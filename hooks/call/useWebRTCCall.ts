import { useCallback, useEffect, useRef, useState } from "react";
import InCallManager from "react-native-incall-manager";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";

import { CALL_RING_TIMEOUT_MS, getIceServers } from "@/config/webrtc";
import {
  emitCallAccept,
  emitCallCancel,
  emitCallEnd,
  emitCallInvite,
  emitCallSignal,
  subscribeCallSocket,
} from "@/services/realtime/callSocket";
import type { CallKind, CallRole, CallSignal } from "@/types/call/signaling";

export type CallStatus =
  | "initializing"
  | "calling"
  | "connecting"
  | "connected"
  | "ended";

/**
 * react-native-webrtc's RTCPeerConnection extends event-target-shim's
 * EventTarget, whose `addEventListener` typings don't surface through the
 * bundled declarations. This narrow view restores type safety for the events
 * we listen to.
 */
type PeerConnectionEvents = {
  addEventListener(
    type: "icecandidate",
    listener: (event: { candidate: RTCIceCandidate | null }) => void,
  ): void;
  addEventListener(type: "connectionstatechange", listener: () => void): void;
};

function peerEvents(pc: RTCPeerConnection): PeerConnectionEvents {
  return pc as unknown as PeerConnectionEvents;
}

type Params = {
  callId: string;
  /** Database user id of the other participant. */
  peerUserId: number;
  role: CallRole;
  kind: CallKind;
};

export type WebRTCCall = {
  status: CallStatus;
  muted: boolean;
  speaker: boolean;
  durationMs: number;
  error: string | null;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  hangUp: () => void;
};

/**
 * Owns a single 1:1 WebRTC audio session: media capture, the peer connection,
 * signaling exchange, audio routing and the full call lifecycle.
 */
export function useWebRTCCall({
  callId,
  peerUserId,
  role,
  kind,
}: Params): WebRTCCall {
  const [status, setStatus] = useState<CallStatus>("initializing");
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(kind === "video");
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteDescriptionSet = useRef(false);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);
  const connectedAtRef = useRef<number | null>(null);
  const statusRef = useRef<CallStatus>("initializing");
  const cleanedUp = useRef(false);

  const setCallStatus = useCallback((next: CallStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const teardown = useCallback(() => {
    if (cleanedUp.current) return;
    cleanedUp.current = true;

    try {
      InCallManager.stopRingback();
      InCallManager.stop();
    } catch {
      // ignore audio-session teardown errors
    }

    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  }, []);

  const endCall = useCallback(
    (notifyPeer: boolean) => {
      if (statusRef.current === "ended") return;

      if (notifyPeer) {
        if (role === "caller" && statusRef.current === "calling") {
          emitCallCancel(peerUserId, callId);
        } else {
          emitCallEnd(peerUserId, callId);
        }
      }

      teardown();
      setCallStatus("ended");
    },
    [callId, peerUserId, role, setCallStatus, teardown],
  );

  const flushPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    const queued = pendingCandidates.current;
    pendingCandidates.current = [];
    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // a late/duplicate candidate is non-fatal
      }
    }
  }, []);

  const handleSignal = useCallback(
    async (signal: CallSignal) => {
      const pc = pcRef.current;
      if (!pc) return;

      try {
        if (signal.type === "offer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp: signal.sdp }),
          );
          remoteDescriptionSet.current = true;
          await flushPendingCandidates();

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          emitCallSignal(peerUserId, callId, {
            type: "answer",
            sdp: answer.sdp ?? "",
          });
        } else if (signal.type === "answer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: "answer", sdp: signal.sdp }),
          );
          remoteDescriptionSet.current = true;
          await flushPendingCandidates();
        } else if (signal.type === "candidate" && signal.candidate) {
          const candidate = new RTCIceCandidate(
            signal.candidate as ConstructorParameters<typeof RTCIceCandidate>[0],
          );
          if (remoteDescriptionSet.current) {
            await pc.addIceCandidate(candidate);
          } else {
            pendingCandidates.current.push(candidate);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Signaling failed");
      }
    },
    [callId, flushPendingCandidates, peerUserId],
  );

  const sendOffer = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      setCallStatus("connecting");
      const offer = await pc.createOffer({});
      await pc.setLocalDescription(offer);
      emitCallSignal(peerUserId, callId, {
        type: "offer",
        sdp: offer.sdp ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create offer");
      endCall(true);
    }
  }, [callId, endCall, peerUserId, setCallStatus]);

  // Set up media + peer connection once.
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        InCallManager.start({ media: "audio" });
        InCallManager.setForceSpeakerphoneOn(kind === "video");
        InCallManager.setKeepScreenOn(true);

        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream as MediaStream;

        const pc = new RTCPeerConnection({ iceServers: getIceServers() });
        pcRef.current = pc;

        stream
          .getTracks()
          .forEach((track) => pc.addTrack(track, stream as MediaStream));

        peerEvents(pc).addEventListener("icecandidate", (event) => {
          if (event.candidate) {
            emitCallSignal(peerUserId, callId, {
              type: "candidate",
              candidate: event.candidate.toJSON(),
            });
          }
        });

        peerEvents(pc).addEventListener("connectionstatechange", () => {
          const state = pc.connectionState;
          if (state === "connected") {
            if (connectedAtRef.current == null) {
              connectedAtRef.current = Date.now();
            }
            InCallManager.stopRingback();
            setCallStatus("connected");
          } else if (state === "failed" || state === "disconnected") {
            endCall(false);
          }
        });

        if (role === "caller") {
          setCallStatus("calling");
          InCallManager.startRingback("_DTMF_");
          emitCallInvite(peerUserId, callId, kind);
        } else {
          setCallStatus("connecting");
          emitCallAccept(peerUserId, callId);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Microphone unavailable",
        );
        endCall(true);
      }
    };

    void start();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Signaling subscription scoped to this call id.
  useEffect(() => {
    const unsubscribe = subscribeCallSocket({
      onAccepted: (payload) => {
        if (payload.callId !== callId || role !== "caller") return;
        void sendOffer();
      },
      onRejected: (payload) => {
        if (payload.callId !== callId) return;
        endCall(false);
      },
      onCanceled: (payload) => {
        if (payload.callId !== callId) return;
        endCall(false);
      },
      onEnded: (payload) => {
        if (payload.callId !== callId) return;
        endCall(false);
      },
      onSignal: (payload) => {
        if (payload.callId !== callId) return;
        void handleSignal(payload.signal);
      },
    });

    return unsubscribe;
  }, [callId, endCall, handleSignal, role, sendOffer]);

  // Caller ring timeout.
  useEffect(() => {
    if (role !== "caller") return;
    const timer = setTimeout(() => {
      if (statusRef.current === "calling") endCall(true);
    }, CALL_RING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [endCall, role]);

  // Live call duration.
  useEffect(() => {
    if (status !== "connected") return;
    const interval = setInterval(() => {
      if (connectedAtRef.current != null) {
        setDurationMs(Date.now() - connectedAtRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Final teardown on unmount.
  useEffect(() => teardown, [teardown]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStreamRef.current
        ?.getAudioTracks()
        .forEach((track) => (track.enabled = !next));
      return next;
    });
  }, []);

  const toggleSpeaker = useCallback(() => {
    setSpeaker((prev) => {
      const next = !prev;
      try {
        InCallManager.setForceSpeakerphoneOn(next);
      } catch {
        // ignore routing errors
      }
      return next;
    });
  }, []);

  const hangUp = useCallback(() => endCall(true), [endCall]);

  return {
    status,
    muted,
    speaker,
    durationMs,
    error,
    toggleMute,
    toggleSpeaker,
    hangUp,
  };
}

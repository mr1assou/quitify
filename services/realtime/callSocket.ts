import { io, type Socket } from "socket.io-client";

import { API_URL } from "@/config/api";
import type {
  CallIdPayload,
  CallKind,
  CallSignal,
  CallSignalPayload,
  IncomingCallPayload,
} from "@/types/call/signaling";

let socket: Socket | null = null;
let wired = false;

const incomingListeners = new Set<(p: IncomingCallPayload) => void>();
const acceptedListeners = new Set<(p: CallIdPayload) => void>();
const rejectedListeners = new Set<(p: CallIdPayload) => void>();
const canceledListeners = new Set<(p: CallIdPayload) => void>();
const endedListeners = new Set<(p: CallIdPayload) => void>();
const signalListeners = new Set<(p: CallSignalPayload) => void>();

function emitAll<T>(listeners: Set<(p: T) => void>, payload: T) {
  listeners.forEach((listener) => listener(payload));
}

function wireSocket(sock: Socket) {
  if (wired) return;
  wired = true;

  sock.on("call:incoming", (p: IncomingCallPayload) => emitAll(incomingListeners, p));
  sock.on("call:accepted", (p: CallIdPayload) => emitAll(acceptedListeners, p));
  sock.on("call:rejected", (p: CallIdPayload) => emitAll(rejectedListeners, p));
  sock.on("call:canceled", (p: CallIdPayload) => emitAll(canceledListeners, p));
  sock.on("call:ended", (p: CallIdPayload) => emitAll(endedListeners, p));
  sock.on("call:signal", (p: CallSignalPayload) => emitAll(signalListeners, p));
}

export type CallSocketHandlers = {
  onIncoming?: (payload: IncomingCallPayload) => void;
  onAccepted?: (payload: CallIdPayload) => void;
  onRejected?: (payload: CallIdPayload) => void;
  onCanceled?: (payload: CallIdPayload) => void;
  onEnded?: (payload: CallIdPayload) => void;
  onSignal?: (payload: CallSignalPayload) => void;
};

export function subscribeCallSocket(handlers: CallSocketHandlers): () => void {
  const cleanups: Array<() => void> = [];

  const register = <T>(
    listeners: Set<(p: T) => void>,
    handler: ((p: T) => void) | undefined,
  ) => {
    if (!handler) return;
    listeners.add(handler);
    cleanups.push(() => listeners.delete(handler));
  };

  register(incomingListeners, handlers.onIncoming);
  register(acceptedListeners, handlers.onAccepted);
  register(rejectedListeners, handlers.onRejected);
  register(canceledListeners, handlers.onCanceled);
  register(endedListeners, handlers.onEnded);
  register(signalListeners, handlers.onSignal);

  return () => cleanups.forEach((cleanup) => cleanup());
}

export function connectCallSocket(accessToken: string): Socket {
  if (socket?.connected) return socket;

  if (socket) {
    socket.disconnect();
    socket = null;
    wired = false;
  }

  socket = io(`${API_URL}/call`, {
    auth: { token: accessToken },
    transports: ["websocket", "polling"],
    extraHeaders: { "ngrok-skip-browser-warning": "1" },
    reconnection: true,
    reconnectionAttempts: 8,
  });

  wireSocket(socket);

  socket.on("disconnect", () => {
    wired = false;
  });

  return socket;
}

export function disconnectCallSocket(): void {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  wired = false;
}

export function emitCallInvite(
  toUserId: number,
  callId: string,
  kind: CallKind,
): void {
  socket?.emit("call:invite", { toUserId, callId, kind });
}

export function emitCallAccept(toUserId: number, callId: string): void {
  socket?.emit("call:accept", { toUserId, callId });
}

export function emitCallReject(toUserId: number, callId: string): void {
  socket?.emit("call:reject", { toUserId, callId });
}

export function emitCallCancel(toUserId: number, callId: string): void {
  socket?.emit("call:cancel", { toUserId, callId });
}

export function emitCallEnd(toUserId: number, callId: string): void {
  socket?.emit("call:end", { toUserId, callId });
}

export function emitCallSignal(
  toUserId: number,
  callId: string,
  signal: CallSignal,
): void {
  socket?.emit("call:signal", { toUserId, callId, signal });
}

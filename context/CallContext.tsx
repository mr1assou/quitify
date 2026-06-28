import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";

import { useApp } from "@/context/AppContext";
import {
  connectCallSocket,
  disconnectCallSocket,
  subscribeCallSocket,
} from "@/services/realtime/callSocket";
import type { IncomingCallPayload } from "@/types/call/signaling";
import { getAccessToken } from "@/utils/auth/authStorage";

type CallContextValue = {
  /** A ringing call waiting for the user to accept or decline. */
  incomingCall: IncomingCallPayload | null;
  clearIncomingCall: () => void;
};

const CallContext = createContext<CallContextValue | null>(null);

/**
 * Keeps the `/call` signaling socket alive while signed in and exposes the
 * current ringing invite so a global modal can prompt the user to answer.
 */
export function CallProvider({ children }: { children: ReactNode }) {
  const { isHydrated, state } = useApp();
  const signedIn = isHydrated && Boolean(state.account);
  const userId = state.account?.userId ?? null;

  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(
    null,
  );

  useEffect(() => {
    if (!signedIn || !userId) {
      disconnectCallSocket();
      setIncomingCall(null);
      return;
    }

    let cancelled = false;
    let unsubscribe = () => undefined as void;

    const connect = async () => {
      const token = await getAccessToken();
      if (!token || cancelled) return;

      unsubscribe = subscribeCallSocket({
        onIncoming: (payload) => {
          if (payload.fromUserId === userId) return;
          setIncomingCall(payload);
        },
        onCanceled: (payload) =>
          setIncomingCall((current) =>
            current?.callId === payload.callId ? null : current,
          ),
        onEnded: (payload) =>
          setIncomingCall((current) =>
            current?.callId === payload.callId ? null : current,
          ),
      });

      connectCallSocket(token);
    };

    void connect();

    return () => {
      cancelled = true;
      unsubscribe();
      disconnectCallSocket();
    };
  }, [signedIn, userId]);

  // Reconnect on foreground so a call that arrived via push is re-delivered.
  useEffect(() => {
    if (!signedIn) return;

    const subscription = AppState.addEventListener("change", (next) => {
      if (next !== "active") return;
      void (async () => {
        const token = await getAccessToken();
        if (token) connectCallSocket(token);
      })();
    });

    return () => subscription.remove();
  }, [signedIn]);

  const value = useMemo<CallContextValue>(
    () => ({
      incomingCall,
      clearIncomingCall: () => setIncomingCall(null),
    }),
    [incomingCall],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCall(): CallContextValue {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used within a CallProvider");
  return ctx;
}

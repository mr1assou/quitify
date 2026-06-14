import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import {
  connectPresenceSocket,
  disconnectPresenceSocket,
  goPresenceOffline,
} from "@/services/realtime/presenceSocket";
import { dbAuthorId } from "@/utils/community/presence";
import { getAccessToken } from "@/utils/authStorage";

/** Keeps the presence WebSocket alive while the user is signed in. */
export function usePresenceSocket() {
  const { isHydrated, state } = useApp();
  const { patchAuthor, patchPresence, setPresenceSnapshot, clearPresence } = useCommunity();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const signedIn = isHydrated && Boolean(state.account);

  useEffect(() => {
    if (!signedIn) {
      disconnectPresenceSocket();
      clearPresence();
      return;
    }

    let cancelled = false;

    const connect = async () => {
      const token = await getAccessToken();
      if (!token || cancelled) return;

      connectPresenceSocket(token, {
        onSnapshot: (payload) => {
          setPresenceSnapshot(payload.onlineUserIds ?? []);
        },
        onUpdate: (payload) => {
          if (!payload?.userId) return;
          patchPresence(payload.userId, payload.isOnline);
          patchAuthor(dbAuthorId(payload.userId), { isOnline: payload.isOnline });
        },
      });
    };

    void connect();

    return () => {
      cancelled = true;
      void (async () => {
        const token = await getAccessToken();
        await goPresenceOffline(token);
      })();
    };
  }, [
    clearPresence,
    patchAuthor,
    patchPresence,
    setPresenceSnapshot,
    signedIn,
    state.account?.email,
  ]);

  useEffect(() => {
    if (!signedIn) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      const prev = appState.current;
      appState.current = nextState;

      if (nextState === "active" && (prev === "background" || prev === "inactive")) {
        void (async () => {
          const token = await getAccessToken();
          if (!token) return;
          connectPresenceSocket(token, {
            onSnapshot: (payload) => {
              setPresenceSnapshot(payload.onlineUserIds ?? []);
            },
            onUpdate: (payload) => {
              if (!payload?.userId) return;
              patchPresence(payload.userId, payload.isOnline);
              patchAuthor(dbAuthorId(payload.userId), { isOnline: payload.isOnline });
            },
          });
        })();
        return;
      }

      if (nextState === "background" || nextState === "inactive") {
        void (async () => {
          const token = await getAccessToken();
          await goPresenceOffline(token);
        })();
      }
    });

    return () => subscription.remove();
  }, [patchAuthor, patchPresence, setPresenceSnapshot, signedIn]);
}

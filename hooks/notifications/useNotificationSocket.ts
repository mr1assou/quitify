import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { useApp } from "@/context/AppContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  connectNotificationSocket,
  disconnectNotificationSocket,
  subscribeNotificationSocket,
} from "@/services/realtime/notificationSocket";
import { getAccessToken } from "@/utils/auth/authStorage";

/** Keeps the notifications WebSocket alive while the user is signed in. */
export function useNotificationSocket() {
  const { isHydrated, state } = useApp();
  const { receiveNotification, refresh, reset } = useNotifications();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const signedIn = isHydrated && Boolean(state.account);
  const userId = state.account?.userId ?? null;

  useEffect(() => {
    if (!signedIn || !userId) {
      disconnectNotificationSocket();
      reset();
      return;
    }

    let cancelled = false;
    let unsubscribe = () => undefined;

    const connect = async () => {
      const token = await getAccessToken();
      if (!token || cancelled) return;

      unsubscribe = subscribeNotificationSocket({
        onNew: (payload) => {
          receiveNotification(payload);
        },
      });

      connectNotificationSocket(token);
      await refresh();
    };

    void connect();

    return () => {
      cancelled = true;
      unsubscribe();
      disconnectNotificationSocket();
    };
  }, [receiveNotification, refresh, reset, signedIn, userId]);

  useEffect(() => {
    if (!signedIn || !userId) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      appState.current = nextState;
      if (nextState !== "active") return;

      void (async () => {
        const token = await getAccessToken();
        if (!token) return;
        connectNotificationSocket(token);
        await refresh();
      })();
    });

    return () => subscription.remove();
  }, [refresh, signedIn, userId]);
}

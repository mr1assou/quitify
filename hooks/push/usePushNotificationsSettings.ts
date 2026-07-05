import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useApp } from "@/context/AppContext";
import {
  clearPushTokensOnBackend,
  fetchPushTokenStatus,
} from "@/services/push/pushTokenApi";
import {
  getCachedPushTokenStatus,
  setCachedPushTokenStatus,
} from "@/services/push/pushSettingsCache";
import {
  cancelMotivationLocalNotifications,
  syncMotivationLocalFromAppState,
} from "@/services/push/motivationLocalNotifications";
import {
  requestPushPermissionAndSaveToken,
  syncPushTokenWithBackend,
} from "@/services/push/registerPushToken";

/** In-app push toggle — on = token in DB, off = token deleted (not OS settings). */
export function usePushNotificationsSettings() {
  const { state } = useApp();
  const [enabled, setEnabled] = useState(
    () => getCachedPushTokenStatus() ?? false,
  );
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(() => getCachedPushTokenStatus() !== null);

  const applyStatus = useCallback((hasToken: boolean) => {
    setCachedPushTokenStatus(hasToken);
    setEnabled(hasToken);
    setReady(true);
  }, []);

  const syncMotivationSchedule = useCallback(
    async (notificationsEnabled: boolean) => {
      if (!state.account?.userId) return;
      if (!notificationsEnabled) {
        await cancelMotivationLocalNotifications();
        return;
      }
      await syncMotivationLocalFromAppState(state, true);
    },
    [state],
  );

  const refresh = useCallback(async () => {
    try {
      const hasToken = await fetchPushTokenStatus();
      applyStatus(hasToken);

      void syncPushTokenWithBackend()
        .then(() => fetchPushTokenStatus())
        .then(applyStatus)
        .catch(() => {});
    } catch {
      // Keep cached toggle state if the API is unreachable.
      if (getCachedPushTokenStatus() !== null) {
        setReady(true);
      }
    }
  }, [applyStatus]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const setNotificationsEnabled = useCallback(
    async (next: boolean) => {
      if (busy) return;

      setBusy(true);
      try {
        if (next) {
          const saved = await requestPushPermissionAndSaveToken();
          if (!saved) {
            applyStatus(false);
            await syncMotivationSchedule(false);
            return;
          }
          applyStatus(true);
          await syncMotivationSchedule(true);
          return;
        }

        await clearPushTokensOnBackend();
        applyStatus(false);
        await syncMotivationSchedule(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not update notifications.";
        Alert.alert("Notifications", message);
        await refresh();
      } finally {
        setBusy(false);
      }
    },
    [applyStatus, busy, refresh, syncMotivationSchedule],
  );

  return {
    enabled,
    busy,
    ready,
    setNotificationsEnabled,
    refresh,
  };
}

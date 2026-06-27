import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import {
  clearPushTokensOnBackend,
  fetchPushTokenStatus,
} from "@/services/push/pushTokenApi";
import { requestPushPermissionAndSaveToken } from "@/services/push/registerPushToken";

/** In-app push toggle — on = token in DB, off = token deleted (not OS settings). */
export function usePushNotificationsSettings() {
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const hasToken = await fetchPushTokenStatus();
      setEnabled(hasToken);
    } catch {
      // Keep current toggle state if the API is unreachable.
    }
  }, []);

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
            setEnabled(false);
            return;
          }
          setEnabled(true);
          return;
        }

        await clearPushTokensOnBackend();
        setEnabled(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not update notifications.";
        Alert.alert("Notifications", message);
        await refresh();
      } finally {
        setBusy(false);
      }
    },
    [busy, refresh],
  );

  return {
    enabled,
    busy,
    setNotificationsEnabled,
    refresh,
  };
}

import { useFocusEffect } from "expo-router";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";

import { useApp } from "@/context/AppContext";
import { clearPushTokensOnBackend } from "@/services/push/pushTokenApi";
import {
  getCachedPushTokenStatus,
  hydrateCachedPushTokenStatus,
  setCachedPushTokenStatus,
  subscribeToCachedPushTokenStatus,
} from "@/services/push/pushSettingsCache";
import {
  cancelMotivationLocalNotifications,
  syncMotivationLocalFromAppState,
} from "@/services/push/motivationLocalNotifications";
import {
  markNotificationsDisabledByUser,
  markNotificationsEnabledByUser,
  resolveSettledPushTokenStatus,
} from "@/services/push/resolveSettledPushTokenStatus";
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

  useEffect(() => {
    void hydrateCachedPushTokenStatus().then(() => {
      const cached = getCachedPushTokenStatus();
      if (cached === null) return;
      setEnabled(cached);
      setReady(true);
    });
  }, []);

  useEffect(
    () =>
      subscribeToCachedPushTokenStatus((hasToken) => {
        if (hasToken === null) {
          setEnabled(false);
          setReady(false);
          return;
        }
        setEnabled(hasToken);
        setReady(true);
      }),
    [],
  );

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
      const hasToken = await resolveSettledPushTokenStatus();
      applyStatus(hasToken);

      if (hasToken) {
        void syncPushTokenWithBackend()
          .then(() => resolveSettledPushTokenStatus())
          .then(applyStatus)
          .catch(() => {});
      }
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
          const permission = await Notifications.getPermissionsAsync();
          if (permission.status !== "granted" && !permission.canAskAgain) {
            Alert.alert(
              "Enable notifications",
              "Notifications are blocked for Quitify. Open your phone settings to enable them.",
              [
                { text: "Not now", style: "cancel" },
                {
                  text: "Open settings",
                  onPress: () => void Linking.openSettings(),
                },
              ],
            );
            applyStatus(false);
            return;
          }

          const saved = await requestPushPermissionAndSaveToken();
          if (!saved) {
            await markNotificationsDisabledByUser();
            applyStatus(false);
            await syncMotivationSchedule(false);
            return;
          }
          await markNotificationsEnabledByUser();
          applyStatus(true);
          await syncMotivationSchedule(true);
          return;
        }

        await clearPushTokensOnBackend();
        await markNotificationsDisabledByUser();
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

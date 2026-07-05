import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

import { useApp } from "@/context/AppContext";
import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import {
  cancelMotivationLocalNotifications,
  syncMotivationLocalFromAppState,
} from "@/services/push/motivationLocalNotifications";
import {
  getCachedPushTokenStatus,
  setCachedPushTokenStatus,
} from "@/services/push/pushSettingsCache";

/**
 * Schedules midday/evening motivation as local notifications (offline at fire time).
 * Refreshes when the user opens the app and when account/profile data changes.
 */
export function useMotivationLocalNotifications() {
  const { isHydrated, state } = useApp();

  const sync = useCallback(async () => {
    if (!isHydrated) return;

    if (!state.account?.userId) {
      await cancelMotivationLocalNotifications();
      return;
    }

    let enabled = getCachedPushTokenStatus();
    if (enabled === null) {
      try {
        enabled = await fetchPushTokenStatus();
        setCachedPushTokenStatus(enabled);
      } catch {
        return;
      }
    }

    await syncMotivationLocalFromAppState(state, enabled);
  }, [isHydrated, state]);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void sync();
      }
    });

    return () => subscription.remove();
  }, [sync]);
}

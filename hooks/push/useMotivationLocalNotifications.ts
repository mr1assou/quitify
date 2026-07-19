import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { useApp } from "@/context/AppContext";
import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import {
  cancelMotivationLocalNotifications,
  syncMotivationLocalNotifications,
} from "@/services/push/motivationLocalNotifications";
import {
  getCachedPushTokenStatus,
  setCachedPushTokenStatus,
  subscribeToCachedPushTokenStatus,
} from "@/services/push/pushSettingsCache";

/**
 * Schedules motivation as local notifications at 12:30 PM and 8:30 PM US Eastern.
 * Refreshes on sign-in and when the app returns to foreground.
 */
export function useMotivationLocalNotifications() {
  const { isHydrated, state } = useApp();
  const userId = state.account?.userId;
  const username = state.profile?.name ?? state.account?.name;
  const motivationCardIndex = state.account?.motivationCardIndex ?? 0;
  const lastSyncKeyRef = useRef<string | null>(null);
  const [cachedStatus, setCachedStatus] = useState(getCachedPushTokenStatus);

  useEffect(
    () => subscribeToCachedPushTokenStatus(setCachedStatus),
    [],
  );

  const sync = useCallback(async () => {
    if (!isHydrated) return;

    if (!userId) {
      await cancelMotivationLocalNotifications();
      lastSyncKeyRef.current = null;
      return;
    }

    let enabled = cachedStatus;
    if (enabled === null) {
      try {
        enabled = await fetchPushTokenStatus();
        setCachedPushTokenStatus(enabled);
      } catch {
        return;
      }
    }

    if (!enabled) {
      await cancelMotivationLocalNotifications();
      lastSyncKeyRef.current = null;
      return;
    }

    const syncKey = `${userId}:${motivationCardIndex}:${username ?? ""}`;
    if (lastSyncKeyRef.current === syncKey) return;
    lastSyncKeyRef.current = syncKey;

    await syncMotivationLocalNotifications({
      enabled: true,
      userId,
      username,
      motivationCardIndex,
    });
  }, [cachedStatus, isHydrated, userId, username, motivationCardIndex]);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        lastSyncKeyRef.current = null;
        void sync();
      }
    });

    return () => subscription.remove();
  }, [sync]);
}

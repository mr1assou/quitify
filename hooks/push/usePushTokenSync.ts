import { useEffect, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import { setCachedPushTokenStatus } from "@/services/push/pushSettingsCache";
import { syncPushTokenWithBackend } from "@/services/push/registerPushToken";

/** On sign-in, refresh or clear push tokens so reinstall does not leave a dead token in the DB. */
export function usePushTokenSync() {
  const { isHydrated, state } = useApp();
  const signedIn = isHydrated && Boolean(state.account);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!signedIn) {
      syncedRef.current = false;
      return;
    }

    if (syncedRef.current) return;
    syncedRef.current = true;

    void (async () => {
      try {
        const hasToken = await fetchPushTokenStatus();
        setCachedPushTokenStatus(hasToken);
        await syncPushTokenWithBackend();
        const synced = await fetchPushTokenStatus();
        setCachedPushTokenStatus(synced);
      } catch (error) {
        console.error(
          "[push] Token sync failed:",
          error instanceof Error ? error.message : error,
        );
      }
    })();
  }, [signedIn]);
}

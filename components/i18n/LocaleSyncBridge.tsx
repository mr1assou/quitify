import { useEffect, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { useLocale } from "@/context/LocaleContext";
import { updateUserPreferences } from "@/services/auth/preferencesApi";

/**
 * Keeps the backend copy of the user's app language in sync, so push
 * notifications are sent in the language the user chose. Runs on launch
 * (covers language picked before login) and on every language change.
 */
export function LocaleSyncBridge() {
  const { locale } = useLocale();
  const { state, isHydrated } = useApp();
  const userId = state.account?.userId;
  const lastSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isHydrated || userId == null) return;

    const syncKey = `${userId}:${locale}`;
    if (lastSyncedRef.current === syncKey) return;
    lastSyncedRef.current = syncKey;

    void updateUserPreferences({ locale }).catch(() => {
      // Retry on the next locale change or app launch.
      lastSyncedRef.current = null;
    });
  }, [isHydrated, userId, locale]);

  return null;
}

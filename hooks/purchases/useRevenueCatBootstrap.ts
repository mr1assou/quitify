import { useEffect, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { syncRevenueCatUser } from "@/services/purchases/revenueCat";

/** Links RevenueCat to the logged-in DB user on sign-up / log-in only. */
export function useRevenueCatBootstrap() {
  const { state, isHydrated } = useApp();
  const userId = state.account?.userId;
  const lastSyncedUserIdRef = useRef<number | undefined | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (lastSyncedUserIdRef.current === userId) return;

    lastSyncedUserIdRef.current = userId;
    void syncRevenueCatUser(userId);
  }, [isHydrated, userId]);
}

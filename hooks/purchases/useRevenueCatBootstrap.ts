import { useEffect, useRef } from "react";

import { useApp } from "@/context/AppContext";
import {
  ensureRevenueCatConfigured,
  syncRevenueCatUser,
} from "@/services/purchases/revenueCat";

/** Initializes RevenueCat and keeps App User ID in sync with the logged-in DB user. */
export function useRevenueCatBootstrap() {
  const { state, isHydrated } = useApp();
  const userId = state.account?.userId;
  const lastSyncedUserIdRef = useRef<number | undefined | null>(null);

  useEffect(() => {
    if (!isHydrated || userId == null) return;
    void ensureRevenueCatConfigured();
  }, [isHydrated, userId]);

  useEffect(() => {
    if (!isHydrated) return;
    if (lastSyncedUserIdRef.current === userId) return;

    lastSyncedUserIdRef.current = userId;
    void syncRevenueCatUser(userId);
  }, [isHydrated, userId]);
}

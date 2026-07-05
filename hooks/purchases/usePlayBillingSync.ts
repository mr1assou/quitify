import { useEffect } from "react";

import { useApp } from "@/context/AppContext";
import { syncPremiumFromPlayStore } from "@/services/purchases";

/** Connects to Google Play Billing and syncs premium after purchase/restore. */
export function usePlayBillingSync() {
  const { isHydrated, setPremium } = useApp();

  useEffect(() => {
    if (!isHydrated) return;

    void syncPremiumFromPlayStore()
      .then(setPremium)
      .catch(() => {});
  }, [isHydrated, setPremium]);
}

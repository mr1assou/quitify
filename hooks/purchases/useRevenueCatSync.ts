import { useEffect } from "react";

import { useApp } from "@/context/AppContext";
import { syncPremiumFromRevenueCat } from "@/services/purchases/revenueCat";

/** Syncs premium entitlement from RevenueCat after app state hydrates. */
export function useRevenueCatSync() {
  const { isHydrated, setPremium } = useApp();

  useEffect(() => {
    if (!isHydrated) return;

    void syncPremiumFromRevenueCat()
      .then(setPremium)
      .catch(() => {});
  }, [isHydrated, setPremium]);
}

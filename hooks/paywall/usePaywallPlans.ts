import { useEffect, useState } from "react";

import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import {
  getCachedPaywallPlans,
  prefetchPaywallPlans,
} from "@/utils/paywall/paywallPlansCache";

type PaywallPlansState = {
  plans: PaywallPlanDisplay[];
  loading: boolean;
  /** True when prices come from Google Play / App Store (user's local currency). */
  usesStorePrices: boolean;
};

/** Paywall prices from RevenueCat / the store only — no hardcoded USD fallback. */
export function usePaywallPlans(): PaywallPlansState {
  const { state, isHydrated } = useApp();
  const userId = state.account?.userId;
  const cached = userId != null ? getCachedPaywallPlans(userId) : undefined;

  const [plans, setPlans] = useState<PaywallPlanDisplay[]>(() => cached ?? []);
  const [loading, setLoading] = useState(() => cached == null);
  const [usesStorePrices, setUsesStorePrices] = useState(() => cached != null);

  useEffect(() => {
    if (!isHydrated || userId == null) {
      setPlans([]);
      setUsesStorePrices(false);
      setLoading(false);
      return;
    }

    const existing = getCachedPaywallPlans(userId);
    if (existing) {
      setPlans(existing);
      setUsesStorePrices(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      const nextPlans = await prefetchPaywallPlans(userId);
      if (cancelled) return;

      setPlans(nextPlans);
      setUsesStorePrices(nextPlans.length > 0);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, userId]);

  return { plans, loading, usesStorePrices };
}

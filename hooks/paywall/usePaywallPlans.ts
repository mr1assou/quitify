import { useEffect, useState } from "react";

import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import {
  fetchPaywallOffering,
  fetchPaywallTrialEligibility,
} from "@/services/purchases";
import { buildPaywallPlansFromOffering } from "@/utils/paywall/buildPaywallPlans";

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

  const [plans, setPlans] = useState<PaywallPlanDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [usesStorePrices, setUsesStorePrices] = useState(false);

  useEffect(() => {
    if (!isHydrated || userId == null) {
      setPlans([]);
      setUsesStorePrices(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const offering = await fetchPaywallOffering();
        if (cancelled) return;

        if (offering) {
          const trialEligibility = await fetchPaywallTrialEligibility(offering);
          if (cancelled) return;
          setPlans(buildPaywallPlansFromOffering(offering, trialEligibility));
          setUsesStorePrices(true);
        } else {
          setPlans([]);
          setUsesStorePrices(false);
        }
      } catch {
        if (!cancelled) {
          setPlans([]);
          setUsesStorePrices(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated, userId]);

  return { plans, loading, usesStorePrices };
}

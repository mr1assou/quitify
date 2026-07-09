import { useEffect, useState } from "react";

import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";
import { useApp } from "@/context/AppContext";
import { fetchPaywallOffering } from "@/services/purchases";
import {
  buildPaywallPlansFromOffering,
  buildPaywallPlansFromUsd,
} from "@/utils/paywall/buildPaywallPlans";

type PaywallPlansState = {
  plans: PaywallPlanDisplay[];
  loading: boolean;
  /** True when prices come from Google Play / App Store (user's local currency). */
  usesStorePrices: boolean;
};

/** Paywall prices from the store when logged in; USD fallback otherwise. */
export function usePaywallPlans(): PaywallPlansState {
  const { state, isHydrated } = useApp();
  const userId = state.account?.userId;

  const [plans, setPlans] = useState<PaywallPlanDisplay[]>(buildPaywallPlansFromUsd);
  const [loading, setLoading] = useState(false);
  const [usesStorePrices, setUsesStorePrices] = useState(false);

  useEffect(() => {
    if (!isHydrated || userId == null) {
      setPlans(buildPaywallPlansFromUsd());
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
          setPlans(buildPaywallPlansFromOffering(offering));
          setUsesStorePrices(true);
        } else {
          setPlans(buildPaywallPlansFromUsd());
          setUsesStorePrices(false);
        }
      } catch {
        if (!cancelled) {
          setPlans(buildPaywallPlansFromUsd());
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

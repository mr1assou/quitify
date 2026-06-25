import { useMemo } from "react";

import {
  PAYWALL_PLANS_USD,
  type PaywallPlanDisplay,
} from "@/constants/paywall/paywallPlans";
import { formatCurrency } from "@/utils/shared/format";

function buildPlans(): PaywallPlanDisplay[] {
  return PAYWALL_PLANS_USD.map((plan) => ({
    id: plan.id,
    label: plan.label,
    rightPrice: formatCurrency(plan.rightAmountUsd, "USD"),
    rightPeriod: plan.rightPeriod,
    subPrice:
      plan.subAmountUsd != null
        ? formatCurrency(plan.subAmountUsd, "USD")
        : null,
    subPeriod: plan.subPeriod,
    trial: plan.trial,
    recommended: plan.recommended,
  }));
}

/** Paywall list prices — always USD. */
export function usePaywallPlans() {
  return useMemo(() => buildPlans(), []);
}

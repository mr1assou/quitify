import type { PurchasesOffering } from "react-native-purchases";

import {
  PAYWALL_PLAN_META,
  type PaywallPlanDisplay,
  type PaywallPlanId,
} from "@/constants/paywall/paywallPlans";
import { packageForPlan } from "@/services/purchases/revenueCat";
import type { PaywallTrialEligibility } from "@/services/purchases/revenueCat";

function mapPlanFromStore(
  planId: PaywallPlanId,
  offering: PurchasesOffering,
): PaywallPlanDisplay | null {
  const meta = PAYWALL_PLAN_META.find((entry) => entry.id === planId);
  if (!meta) return null;

  const product = packageForPlan(offering, planId)?.product;
  if (!product?.priceString) return null;

  if (planId === "yearly") {
    return {
      id: meta.id,
      label: meta.label,
      rightPrice: product.pricePerMonthString ?? product.priceString,
      rightPeriod: meta.rightPeriod,
      subPrice: product.priceString,
      subPeriod: meta.subPeriod,
      trial: meta.trial,
      recommended: meta.recommended,
    };
  }

  return {
    id: meta.id,
    label: meta.label,
    rightPrice: product.priceString,
    rightPeriod: meta.rightPeriod,
    subPrice: null,
    subPeriod: null,
    trial: meta.trial,
    recommended: meta.recommended,
  };
}

/**
 * Localized prices from Google Play / App Store via RevenueCat.
 * When eligibility is known, the trial badge is hidden for plans the store
 * would charge at full price — the paywall never promises a trial the user
 * won't get at checkout.
 */
export function buildPaywallPlansFromOffering(
  offering: PurchasesOffering,
  trialEligibility?: PaywallTrialEligibility,
): PaywallPlanDisplay[] {
  return PAYWALL_PLAN_META.flatMap((plan) => {
    const display = mapPlanFromStore(plan.id, offering);
    if (!display) return [];
    if (trialEligibility && !trialEligibility[plan.id]) {
      return [{ ...display, trial: null }];
    }
    return [display];
  });
}

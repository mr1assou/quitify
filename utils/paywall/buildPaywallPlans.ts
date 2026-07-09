import type { PurchasesOffering } from "react-native-purchases";

import {
  PAYWALL_PLANS_USD,
  type PaywallPlanDisplay,
  type PaywallPlanId,
} from "@/constants/paywall/paywallPlans";
import { packageForPlan } from "@/services/purchases/revenueCat";
import { formatCurrency } from "@/utils/shared/format";

function usdPlanDisplay(planId: PaywallPlanId): PaywallPlanDisplay {
  const plan = PAYWALL_PLANS_USD.find((entry) => entry.id === planId);
  if (!plan) throw new Error(`Unknown paywall plan: ${planId}`);

  return {
    id: plan.id,
    label: plan.label,
    rightPrice: formatCurrency(plan.rightAmountUsd, "USD"),
    rightPeriod: plan.rightPeriod,
    subPrice:
      plan.subAmountUsd != null ? formatCurrency(plan.subAmountUsd, "USD") : null,
    subPeriod: plan.subPeriod,
    trial: plan.trial,
    recommended: plan.recommended,
  };
}

/** Static USD prices — used before login or when the store is unavailable. */
export function buildPaywallPlansFromUsd(): PaywallPlanDisplay[] {
  return PAYWALL_PLANS_USD.map((plan) => usdPlanDisplay(plan.id));
}

function mapPlanFromStore(
  planId: PaywallPlanId,
  offering: PurchasesOffering,
): PaywallPlanDisplay {
  const meta = PAYWALL_PLANS_USD.find((entry) => entry.id === planId);
  if (!meta) throw new Error(`Unknown paywall plan: ${planId}`);

  const product = packageForPlan(offering, planId)?.product;
  if (!product?.priceString) return usdPlanDisplay(planId);

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

/** Localized prices from Google Play / App Store via RevenueCat. */
export function buildPaywallPlansFromOffering(
  offering: PurchasesOffering,
): PaywallPlanDisplay[] {
  return PAYWALL_PLANS_USD.map((plan) => mapPlanFromStore(plan.id, offering));
}

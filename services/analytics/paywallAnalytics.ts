import {
  PAYWALL_ANALYTICS_EVENT,
  type PaywallPurchaseType,
  type PaywallSource,
} from "@/constants/analytics/paywall";
import type { PaywallPlanId } from "@/constants/paywall/paywallPlans";
import { logAnalyticsEvent } from "@/services/analytics/logEvent";

/** Paywall screen opened. */
export function trackPaywallView(source: PaywallSource): void {
  void logAnalyticsEvent(PAYWALL_ANALYTICS_EVENT.paywallView, {
    source,
  });
}

/** User unlocked Premium via purchase or restore. */
export function trackPaywallPurchaseSuccess(input: {
  source: PaywallSource;
  planId?: PaywallPlanId;
  purchaseType: PaywallPurchaseType;
}): void {
  void logAnalyticsEvent(PAYWALL_ANALYTICS_EVENT.paywallPurchaseSuccess, {
    source: input.source,
    purchase_type: input.purchaseType,
    ...(input.planId ? { plan_id: input.planId } : {}),
  });
}

/** User closed the paywall without buying. */
export function trackPaywallDismiss(source: PaywallSource): void {
  void logAnalyticsEvent(PAYWALL_ANALYTICS_EVENT.paywallDismiss, {
    source,
  });
}

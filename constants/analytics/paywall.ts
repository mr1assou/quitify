/**
 * Paywall funnel Analytics.
 * Use one event name + `source` / `plan_id` params to measure attraction.
 */
export const PAYWALL_SOURCE = {
  post_signup: "post_signup",
  day5: "day5",
  premium_gate: "premium_gate",
  profile: "profile",
  header: "header",
  unknown: "unknown",
} as const;

export type PaywallSource =
  (typeof PAYWALL_SOURCE)[keyof typeof PAYWALL_SOURCE];

export const PAYWALL_ANALYTICS_EVENT = {
  paywallView: "paywall_view",
  paywallPurchaseSuccess: "paywall_purchase_success",
  paywallDismiss: "paywall_dismiss",
} as const;

export type PaywallPurchaseType = "purchase" | "restore";

export function parsePaywallSource(value: unknown): PaywallSource {
  if (
    typeof value === "string" &&
    (Object.values(PAYWALL_SOURCE) as string[]).includes(value)
  ) {
    return value as PaywallSource;
  }
  return PAYWALL_SOURCE.unknown;
}

/** Paywall funnel types for Firebase Analytics. */
export type PaywallAnalyticsType = "normal" | "special" | "spin";

export const PAYWALL_EVENTS = {
  view: "paywall_view",
  close: "paywall_close",
  purchaseSuccess: "paywall_purchase_success",
  purchaseFail: "paywall_purchase_fail",
} as const;

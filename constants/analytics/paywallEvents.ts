/** Separate Firebase events so each paywall shows up on its own. */
export const PAYWALL_EVENTS = {
  view: "paywall_view",
  close: "paywall_close",
  purchaseSuccess: "paywall_purchase_success",
  purchaseFail: "paywall_purchase_fail",
  specialView: "special_paywall_view",
  specialClose: "special_paywall_close",
  specialPurchaseSuccess: "special_paywall_purchase_success",
  specialPurchaseFail: "special_paywall_purchase_fail",
  spinView: "spin_paywall_view",
  spinClose: "spin_paywall_close",
} as const;

/** Google Play subscription product ids (must match Play Console). */
export const PLAY_SUBSCRIPTION_PRODUCT_IDS = {
  monthly: "quitify_premium_monthly",
  yearly: "quitify_premium_yearly",
} as const;

export const ALL_PLAY_SUBSCRIPTION_SKUS = Object.values(PLAY_SUBSCRIPTION_PRODUCT_IDS);

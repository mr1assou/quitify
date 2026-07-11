/** Google Play subscription product ids (must match Play Console). */
export const PLAY_SUBSCRIPTION_PRODUCT_IDS = {
  monthly: "quitify_premium_monthly",
  yearly: "quitify_premium_yearly",
} as const;

/** Offer on base plan `annual` — SubscriptionOption id is `annual:trial-3days-annual`. */
export const PLAY_YEARLY_TRIAL_OFFER_ID = "trial-3days-annual";

/** Google Play base plan id for the yearly subscription. */
export const PLAY_YEARLY_BASE_PLAN_ID = "annual";

export const ALL_PLAY_SUBSCRIPTION_SKUS = Object.values(PLAY_SUBSCRIPTION_PRODUCT_IDS);

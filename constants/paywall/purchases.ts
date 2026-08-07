/** Google Play subscription product ids (must match Play Console). */
export const PLAY_SUBSCRIPTION_PRODUCT_IDS = {
  monthly: "quitify_premium_monthly",
  yearly: "quitify_premium_yearly",
} as const;

/** Offer on base plan `monthly` — SubscriptionOption id is `monthly:free-trial-3day`. */
export const PLAY_MONTHLY_TRIAL_OFFER_ID = "free-trial-3day";

/** Offer on base plan `annual` — SubscriptionOption id is `annual:trial-3days-annual`. */
export const PLAY_YEARLY_TRIAL_OFFER_ID = "trial-3days-annual";

/**
 * New-customer special offer — SubscriptionOption id is `annual:discount-29off`.
 * Play eligibility: "Never had this subscription".
 * Phases: 7-day free trial → 2 discounted yearly periods → full price.
 */
export const PLAY_YEARLY_SPECIAL_OFFER_ID = "discount-29off";

/**
 * Returning / lapsed-subscriber special offer — create this in Play Console with the
 * same phases as `discount-29off`, but eligibility for users who already had yearly
 * (or use Developer determined). Option id: `annual:discount-29off-returning`.
 */
export const PLAY_YEARLY_WINBACK_OFFER_ID = "discount-29off-returning";

/** Prefer new-customer offer first, then win-back for ex-subscribers. */
export const PLAY_YEARLY_SPECIAL_OFFER_IDS = [
  PLAY_YEARLY_SPECIAL_OFFER_ID,
  PLAY_YEARLY_WINBACK_OFFER_ID,
] as const;

/** Google Play base plan id for the monthly subscription. */
export const PLAY_MONTHLY_BASE_PLAN_ID = "monthly";

/** Google Play base plan id for the yearly subscription. */
export const PLAY_YEARLY_BASE_PLAN_ID = "annual";

export const ALL_PLAY_SUBSCRIPTION_SKUS = Object.values(PLAY_SUBSCRIPTION_PRODUCT_IDS);

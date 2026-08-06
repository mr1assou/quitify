import type { PaywallPlanDisplay } from "@/constants/paywall/paywallPlans";

/** Localized special yearly offer from Google Play / RevenueCat (`discount-29off`). */
export type SpecialPaywallOfferDisplay = {
  plan: PaywallPlanDisplay;
  /** Discounted yearly price string from the offer phase, e.g. "£22.00". */
  discountedYearlyPrice: string;
  /** Base yearly list price string, e.g. "£30.99". */
  originalYearlyPrice: string;
  /** Rounded percent off from original → discounted. */
  discountPercent: number;
  /** True when the offer includes a free trial phase. */
  hasFreeTrial: boolean;
};

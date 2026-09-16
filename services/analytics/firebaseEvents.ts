import { getAnalytics, logEvent } from "@react-native-firebase/analytics";

import { FUNNEL_EVENTS } from "@/constants/analytics/funnel";
import {
  PAYWALL_EVENTS,
  type PaywallAnalyticsType,
} from "@/constants/analytics/paywallEvents";

type FunnelParams = Record<string, string | number>;

/** Fire-and-forget Firebase Analytics event (safe if native SDK is missing). */
export function logFirebaseEvent(name: string, params?: FunnelParams): void {
  try {
    if (__DEV__) {
      console.log("[firebase] event:", name, params ?? {});
    }
    void logEvent(getAnalytics(), name, params);
  } catch (error) {
    if (__DEV__) {
      console.warn("[firebase] logEvent failed:", name, error);
    }
  }
}

export function logWelcomeView(): void {
  logFirebaseEvent(FUNNEL_EVENTS.welcomeView);
}

export function logIntroSlide(slide: number): void {
  logFirebaseEvent(FUNNEL_EVENTS.introSlide, { slide });
}

export function logOnboardingStep(step: number): void {
  logFirebaseEvent(FUNNEL_EVENTS.onboardingStep, { step });
}

export function logSignupView(): void {
  logFirebaseEvent(FUNNEL_EVENTS.signupView);
}

export function logSignupSuccess(method: "email" | "google"): void {
  logFirebaseEvent(FUNNEL_EVENTS.signupSuccess, { method });
}

export function logPaywallView(type: PaywallAnalyticsType): void {
  logFirebaseEvent(PAYWALL_EVENTS.view, { type });
}

export function logPaywallClose(type: PaywallAnalyticsType): void {
  logFirebaseEvent(PAYWALL_EVENTS.close, { type });
}

export function logPaywallPurchaseSuccess(
  type: Extract<PaywallAnalyticsType, "normal" | "special">,
): void {
  logFirebaseEvent(PAYWALL_EVENTS.purchaseSuccess, { type });
}

export function logPaywallPurchaseFail(
  type: Extract<PaywallAnalyticsType, "normal" | "special">,
): void {
  logFirebaseEvent(PAYWALL_EVENTS.purchaseFail, { type });
}

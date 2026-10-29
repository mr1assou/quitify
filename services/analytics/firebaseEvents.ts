import { getAnalytics, logEvent } from "@react-native-firebase/analytics";

import {
  FUNNEL_EVENTS,
  INTRO_SLIDE_EVENTS,
  ONBOARDING_STEP_EVENTS,
} from "@/constants/analytics/funnel";
import { PAYWALL_EVENTS } from "@/constants/analytics/paywallEvents";

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
  const name = INTRO_SLIDE_EVENTS[slide as keyof typeof INTRO_SLIDE_EVENTS];
  if (!name) return;
  logFirebaseEvent(name);
}

export function logOnboardingStep(step: number): void {
  const name = ONBOARDING_STEP_EVENTS[step as keyof typeof ONBOARDING_STEP_EVENTS];
  if (!name) return;
  logFirebaseEvent(name);
}

export function logSignupView(): void {
  logFirebaseEvent(FUNNEL_EVENTS.signupView);
}

export function logSignupSuccess(method: "email" | "google"): void {
  logFirebaseEvent(FUNNEL_EVENTS.signupSuccess, { method });
}

export function logPaywallView(): void {
  logFirebaseEvent(PAYWALL_EVENTS.view);
}

export function logPaywallClose(): void {
  logFirebaseEvent(PAYWALL_EVENTS.close);
}

export function logPaywallPurchaseSuccess(): void {
  logFirebaseEvent(PAYWALL_EVENTS.purchaseSuccess);
}

export function logPaywallPurchaseFail(): void {
  logFirebaseEvent(PAYWALL_EVENTS.purchaseFail);
}

export function logSpecialPaywallView(): void {
  logFirebaseEvent(PAYWALL_EVENTS.specialView);
}

export function logSpecialPaywallClose(): void {
  logFirebaseEvent(PAYWALL_EVENTS.specialClose);
}

export function logSpecialPaywallPurchaseSuccess(): void {
  logFirebaseEvent(PAYWALL_EVENTS.specialPurchaseSuccess);
}

export function logSpecialPaywallPurchaseFail(): void {
  logFirebaseEvent(PAYWALL_EVENTS.specialPurchaseFail);
}

export function logSpinPaywallView(): void {
  logFirebaseEvent(PAYWALL_EVENTS.spinView);
}

export function logSpinPaywallClose(): void {
  logFirebaseEvent(PAYWALL_EVENTS.spinClose);
}

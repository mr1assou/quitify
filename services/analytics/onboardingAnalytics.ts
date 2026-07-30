import {
  ANALYTICS_EVENT,
  ONBOARDING_STEP_ORDER,
  type OnboardingSignupMethod,
  type OnboardingStepName,
} from "@/constants/analytics/onboarding";
import {
  logAnalyticsEvent,
  setAnalyticsUserId,
} from "@/services/analytics/logEvent";

/** Set after successful signup; consumed when Home first mounts. */
let pendingHomeOpenAfterOnboarding = false;

export function markPendingHomeOpenAfterOnboarding(): void {
  pendingHomeOpenAfterOnboarding = true;
}

/** Welcome → Get started. */
export function trackOnboardingStart(): void {
  void logAnalyticsEvent(ANALYTICS_EVENT.onboardingStart);
}

/** User finished a screen and moved forward. */
export function trackOnboardingStepComplete(stepName: OnboardingStepName): void {
  void logAnalyticsEvent(ANALYTICS_EVENT.onboardingStepComplete, {
    step_name: stepName,
    step_order: ONBOARDING_STEP_ORDER[stepName],
  });
}

/** Successful signup after the onboarding questionnaire. */
export function trackUserSignup(
  signupMethod: OnboardingSignupMethod,
  userId?: number | null,
): void {
  if (userId != null) {
    void setAnalyticsUserId(String(userId));
  }
  void logAnalyticsEvent(ANALYTICS_EVENT.userSignup, {
    signup_method: signupMethod,
  });
  markPendingHomeOpenAfterOnboarding();
}

/** Fire once when Home opens right after onboarding signup. */
export function trackHomeOpenAfterOnboardingIfPending(): void {
  if (!pendingHomeOpenAfterOnboarding) return;
  pendingHomeOpenAfterOnboarding = false;
  void logAnalyticsEvent(ANALYTICS_EVENT.homeOpen, {
    source: "after_onboarding",
  });
}

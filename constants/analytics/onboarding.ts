/**
 * Ordered onboarding funnel steps for Analytics.
 * `step_name` is sent with `onboarding_step_complete`.
 */
export const ONBOARDING_STEP = {
  intro_quitting_not_luck: "intro_quitting_not_luck",
  intro_hardest_part: "intro_hardest_part",
  intro_transformation: "intro_transformation",
  intro_your_moment: "intro_your_moment",
  intro_join_those: "intro_join_those",
  reasons: "reasons",
  motivation: "motivation",
  quit_attempts: "quit_attempts",
  interests: "interests",
  create_profile: "create_profile",
  nicotine: "nicotine",
  analyzing: "analyzing",
} as const;

export type OnboardingStepName =
  (typeof ONBOARDING_STEP)[keyof typeof ONBOARDING_STEP];

/** 1-based order in the funnel (after `onboarding_start`). */
export const ONBOARDING_STEP_ORDER: Record<OnboardingStepName, number> = {
  intro_quitting_not_luck: 1,
  intro_hardest_part: 2,
  intro_transformation: 3,
  intro_your_moment: 4,
  intro_join_those: 5,
  reasons: 6,
  motivation: 7,
  quit_attempts: 8,
  interests: 9,
  create_profile: 10,
  nicotine: 11,
  analyzing: 12,
};

export const ANALYTICS_EVENT = {
  onboardingStart: "onboarding_start",
  onboardingStepComplete: "onboarding_step_complete",
  userSignup: "user_signup",
  homeOpen: "home_open",
} as const;

export type OnboardingSignupMethod = "google" | "email";

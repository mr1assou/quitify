/** Signup funnel events for Firebase Analytics drop-off tracking. */
export const FUNNEL_EVENTS = {
  welcomeView: "quitify_welcome_view",
  signupView: "quitify_signup_view",
} as const;

/** One event per signup method. There is no method parameter. */
export const SIGNUP_SUCCESS_EVENTS = {
  email: "signup_success_email",
  google: "signup_success_google",
} as const;

/** One event per intro slide. There is no slide-number parameter. */
export const INTRO_SLIDE_EVENTS = {
  1: "intro_slide_1",
  2: "intro_slide_2",
  3: "intro_slide_3",
  4: "intro_slide_4",
  5: "intro_slide_5",
} as const;

/** One event per onboarding step. There is no step-number parameter. */
export const ONBOARDING_STEP_EVENTS = {
  1: "onboarding_step_1",
  2: "onboarding_step_2",
  3: "onboarding_step_3",
  4: "onboarding_step_4",
  5: "onboarding_step_5",
  6: "onboarding_step_6",
} as const;

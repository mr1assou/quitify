import type { IntroSlideId } from "@/types/app/intro";
import {
  ONBOARDING_STEP,
  type OnboardingStepName,
} from "@/constants/analytics/onboarding";

const INTRO_SLIDE_TO_STEP: Record<IntroSlideId, OnboardingStepName> = {
  success: ONBOARDING_STEP.intro_quitting_not_luck,
  "short-time": ONBOARDING_STEP.intro_hardest_part,
  transformation: ONBOARDING_STEP.intro_transformation,
  chance: ONBOARDING_STEP.intro_your_moment,
  "after-onboard": ONBOARDING_STEP.intro_join_those,
};

export function onboardingStepForIntroSlide(
  slideId: IntroSlideId,
): OnboardingStepName {
  return INTRO_SLIDE_TO_STEP[slideId];
}

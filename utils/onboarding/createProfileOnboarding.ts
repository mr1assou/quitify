import type { OnboardingDraft } from "@/types";
import { isValidOnboardingUsername } from "@/constants/onboarding/onboardingUsername";
import { isQuitDateComplete } from "@/utils/onboarding/quitPlan";

/** Step 5 — profile details + quit start date. */
export function isCreateProfileStepComplete(draft: OnboardingDraft): boolean {
  const usernameOk = isValidOnboardingUsername(draft.username);
  const sexOk = draft.sex !== undefined;

  const countryOk =
    typeof draft.countryCode === "string" && draft.countryCode.length === 2;

  return usernameOk && sexOk && countryOk && isQuitDateComplete(draft);
}

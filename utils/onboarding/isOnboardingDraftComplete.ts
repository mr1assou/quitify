import type { OnboardingDraft } from "@/types";
import { isValidOnboardingUsername } from "@/constants/onboarding/onboardingUsername";

/** True when the user finished the 6-step onboarding flow (not the welcome sign-in shortcut). */
export function isOnboardingDraftComplete(draft: OnboardingDraft): boolean {
  return (
    isValidOnboardingUsername(draft.username) &&
    draft.quitReasonIds.length > 0 &&
    draft.cigarettesPerPack >= 1
  );
}

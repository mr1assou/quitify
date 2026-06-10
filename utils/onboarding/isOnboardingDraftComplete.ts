import type { OnboardingDraft } from "@/types";

/** True when the user finished the 6-step onboarding flow (not the welcome sign-in shortcut). */
export function isOnboardingDraftComplete(draft: OnboardingDraft): boolean {
  return (
    draft.username.trim().length > 0 &&
    draft.quitReasonIds.length > 0 &&
    draft.cigarettesPerPack >= 1
  );
}

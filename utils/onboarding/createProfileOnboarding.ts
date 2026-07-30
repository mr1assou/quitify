import type { OnboardingDraft } from "@/types";
import { isValidOnboardingUsername } from "@/constants/onboarding/onboardingUsername";
import { isQuitDateComplete } from "@/utils/onboarding/quitPlan";

export type CreateProfileFieldErrors = {
  username?: boolean;
  usernameTaken?: boolean;
  sex?: boolean;
  country?: boolean;
  quitDate?: boolean;
};

/** Step 5 — profile details + quit start date. */
export function isCreateProfileStepComplete(draft: OnboardingDraft): boolean {
  const usernameOk = isValidOnboardingUsername(draft.username);
  const sexOk = draft.sex !== undefined;

  const countryOk =
    typeof draft.countryCode === "string" && draft.countryCode.length === 2;

  return usernameOk && sexOk && countryOk && isQuitDateComplete(draft);
}

/** Missing / invalid fields after the user taps Continue. */
export function getCreateProfileFieldErrors(
  draft: OnboardingDraft,
  opts: { usernameTaken: boolean },
): CreateProfileFieldErrors {
  const errors: CreateProfileFieldErrors = {};

  if (!isValidOnboardingUsername(draft.username)) {
    errors.username = true;
  } else if (opts.usernameTaken) {
    errors.usernameTaken = true;
  }

  if (draft.sex === undefined) errors.sex = true;

  if (!(typeof draft.countryCode === "string" && draft.countryCode.length === 2)) {
    errors.country = true;
  }

  if (!isQuitDateComplete(draft)) errors.quitDate = true;

  return errors;
}

import type { OnboardingDraft } from "@/types";
import { isValidOnboardingUsername } from "@/constants/onboarding/onboardingUsername";

export type CreateProfileFieldErrors = {
  username?: boolean;
  usernameTaken?: boolean;
  sex?: boolean;
  country?: boolean;
  profileImage?: boolean;
};

/** Step 5 — profile details + profile photo (quit date moved to step 6). */
export function isCreateProfileStepComplete(draft: OnboardingDraft): boolean {
  const usernameOk = isValidOnboardingUsername(draft.username);
  const sexOk = draft.sex !== undefined;

  const countryOk =
    typeof draft.countryCode === "string" && draft.countryCode.length === 2;

  const profileImageOk =
    typeof draft.customProfileImageUrl === "string" &&
    draft.customProfileImageUrl.length > 0;

  return usernameOk && sexOk && countryOk && profileImageOk;
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

  if (
    !(
      typeof draft.customProfileImageUrl === "string" &&
      draft.customProfileImageUrl.length > 0
    )
  ) {
    errors.profileImage = true;
  }

  return errors;
}

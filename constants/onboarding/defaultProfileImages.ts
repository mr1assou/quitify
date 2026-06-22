import type { ImageSourcePropType } from "react-native";

import type { ProfileSex } from "@/types/onboarding/onboarding";

export const DEFAULT_PROFILE_IMAGE_MALE = require("../../assets/images/profiles/profile1.png") as ImageSourcePropType;
export const DEFAULT_PROFILE_IMAGE_FEMALE = require("../../assets/images/profiles/profile2.png") as ImageSourcePropType;

/** Bundled default avatar for onboarding (male → profile1, female / prefer not to say → profile2). */
export function defaultProfileImageSource(
  sex: ProfileSex | undefined,
): ImageSourcePropType {
  return sex === "male" ? DEFAULT_PROFILE_IMAGE_MALE : DEFAULT_PROFILE_IMAGE_FEMALE;
}

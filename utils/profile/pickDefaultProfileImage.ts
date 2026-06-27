import {
  DEFAULT_PROFILE_IMAGE_FEMALE_PATHS,
  DEFAULT_PROFILE_IMAGE_MALE_PATHS,
  DEFAULT_PROFILE_IMAGE_PATHS,
  type DefaultProfileImagePath,
} from "@/constants/profile/defaultProfileImagePaths";
import type { ProfileSex } from "@/types/onboarding/onboarding";

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function profileImagePoolForSex(
  sex?: ProfileSex,
): readonly DefaultProfileImagePath[] {
  if (sex === "male") return DEFAULT_PROFILE_IMAGE_MALE_PATHS;
  if (sex === "female") return DEFAULT_PROFILE_IMAGE_FEMALE_PATHS;
  return DEFAULT_PROFILE_IMAGE_PATHS;
}

/** Picks a bundled default avatar filename for onboarding / offline profile. */
export function pickDefaultProfileImageForSex(sex?: ProfileSex): DefaultProfileImagePath {
  return pickRandom(profileImagePoolForSex(sex));
}

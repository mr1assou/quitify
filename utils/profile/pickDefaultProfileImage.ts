import {
  DEFAULT_PROFILE_IMAGE_PATHS,
  type DefaultProfileImagePath,
} from "@/constants/profile/defaultProfileImagePaths";

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Picks a bundled avatar without using the user's sex. */
export function pickDefaultProfileImage(): DefaultProfileImagePath {
  return pickRandom(DEFAULT_PROFILE_IMAGE_PATHS);
}

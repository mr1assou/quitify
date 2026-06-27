import type { ImageSource } from "expo-image";

import {
  DEFAULT_PROFILE_IMAGE_FEMALE,
  DEFAULT_PROFILE_IMAGE_MALE,
} from "@/constants/onboarding/defaultProfileImages";
import {
  DEFAULT_PROFILE_IMAGE_PATH_FEMALE,
  DEFAULT_PROFILE_IMAGE_PATH_MALE,
} from "@/constants/profile/defaultProfileImagePaths";
import type { ProfileSex } from "@/types/onboarding/onboarding";

function filenameFromImageRef(value: string): string {
  return value.trim().split("/").pop()?.split("?")[0] ?? value.trim();
}

export function isDefaultProfileImagePath(
  imageUrl: string | null | undefined,
): boolean {
  const name = filenameFromImageRef(imageUrl ?? "");
  return (
    name === DEFAULT_PROFILE_IMAGE_PATH_MALE ||
    name === DEFAULT_PROFILE_IMAGE_PATH_FEMALE
  );
}

export function defaultProfileImagePath(sex?: ProfileSex): string {
  return sex === "male"
    ? DEFAULT_PROFILE_IMAGE_PATH_MALE
    : DEFAULT_PROFILE_IMAGE_PATH_FEMALE;
}

/** Remote URL or bundled default → image source for expo-image / RN Image. */
export function resolveAvatarImageSource(
  imageUrl: string | null | undefined,
): ImageSource | null {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;

  const filename = filenameFromImageRef(trimmed);
  if (filename === DEFAULT_PROFILE_IMAGE_PATH_MALE) {
    return DEFAULT_PROFILE_IMAGE_MALE;
  }
  if (filename === DEFAULT_PROFILE_IMAGE_PATH_FEMALE) {
    return DEFAULT_PROFILE_IMAGE_FEMALE;
  }

  return { uri: trimmed };
}

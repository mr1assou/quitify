import type { ImageSource } from "expo-image";

import {
  bundledProfileImageSource,
  isBundledProfileImagePath,
} from "@/constants/onboarding/defaultProfileImages";
import type { ProfileSex } from "@/types/onboarding/onboarding";

import { pickDefaultProfileImageForSex } from "./pickDefaultProfileImage";

function filenameFromImageRef(value: string): string {
  return value.trim().split("/").pop()?.split("?")[0] ?? value.trim();
}

export function isDefaultProfileImagePath(
  imageUrl: string | null | undefined,
): boolean {
  const name = filenameFromImageRef(imageUrl ?? "");
  return isBundledProfileImagePath(name);
}

export function defaultProfileImagePath(sex?: ProfileSex): string {
  return pickDefaultProfileImageForSex(sex);
}

/** Remote URL or bundled default → image source for expo-image / RN Image. */
export function resolveAvatarImageSource(
  imageUrl: string | null | undefined,
): ImageSource | null {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;

  const filename = filenameFromImageRef(trimmed);
  if (isBundledProfileImagePath(filename)) {
    return bundledProfileImageSource(filename);
  }

  return { uri: trimmed };
}

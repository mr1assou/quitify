import type { ImageSource } from "expo-image";

import {
  bundledProfileImageSource,
  isBundledProfileImagePath,
} from "@/constants/onboarding/defaultProfileImages";
import { pickDefaultProfileImage } from "./pickDefaultProfileImage";

const PROFILE_IMAGE_FILENAME_PATTERN = /^profile\d+\.webp$/i;

function filenameFromImageRef(value: string): string {
  return value.trim().split("/").pop()?.split("?")[0] ?? value.trim();
}

export function isDefaultProfileImagePath(
  imageUrl: string | null | undefined,
): boolean {
  const name = filenameFromImageRef(imageUrl ?? "");
  return isBundledProfileImagePath(name) || PROFILE_IMAGE_FILENAME_PATTERN.test(name);
}

export function defaultProfileImagePath(): string {
  return pickDefaultProfileImage();
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

  // Older profiles may still reference a bundled filename that was removed.
  if (PROFILE_IMAGE_FILENAME_PATTERN.test(filename) && !trimmed.includes("://")) {
    return bundledProfileImageSource("profile1.webp");
  }

  return { uri: trimmed };
}

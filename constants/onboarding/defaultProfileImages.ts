import type { ImageSourcePropType } from "react-native";

import {
  DEFAULT_PROFILE_IMAGE_PATHS,
  type DefaultProfileImagePath,
} from "@/constants/profile/defaultProfileImagePaths";
import type { ProfileSex } from "@/types/onboarding/onboarding";
import { pickDefaultProfileImageForSex } from "@/utils/profile/pickDefaultProfileImage";

const PROFILE_IMAGE_SOURCES: Record<DefaultProfileImagePath, ImageSourcePropType> = {
  "profile1.webp": require("../../assets/images/profiles/profile1.webp"),
  "profile2.webp": require("../../assets/images/profiles/profile2.webp"),
  "profile3.webp": require("../../assets/images/profiles/profile3.webp"),
  "profile4.webp": require("../../assets/images/profiles/profile4.webp"),
  "profile5.webp": require("../../assets/images/profiles/profile5.webp"),
  "profile6.webp": require("../../assets/images/profiles/profile6.webp"),
  "profile7.webp": require("../../assets/images/profiles/profile7.webp"),
};

export function bundledProfileImageSource(
  imagePath: DefaultProfileImagePath,
): ImageSourcePropType {
  return PROFILE_IMAGE_SOURCES[imagePath];
}

export function isBundledProfileImagePath(
  filename: string,
): filename is DefaultProfileImagePath {
  return (DEFAULT_PROFILE_IMAGE_PATHS as readonly string[]).includes(filename);
}

/** Bundled default avatar for display (uses a stable path when provided). */
export function defaultProfileImageSource(
  sex?: ProfileSex,
  imagePath?: string,
): ImageSourcePropType {
  const filename = imagePath?.trim().split("/").pop()?.split("?")[0];
  if (filename && isBundledProfileImagePath(filename)) {
    return PROFILE_IMAGE_SOURCES[filename];
  }

  return PROFILE_IMAGE_SOURCES[pickDefaultProfileImageForSex(sex)];
}

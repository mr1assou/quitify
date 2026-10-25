import type { ImageSourcePropType } from "react-native";

import {
  DEFAULT_PROFILE_IMAGE_PATHS,
  type DefaultProfileImagePath,
} from "@/constants/profile/defaultProfileImagePaths";
import { pickDefaultProfileImage } from "@/utils/profile/pickDefaultProfileImage";

const PROFILE_IMAGE_SOURCES: Record<DefaultProfileImagePath, ImageSourcePropType> = {
  "profile24.webp": require("../../assets/images/profiles/profile24.webp"),
  "profile14.webp": require("../../assets/images/profiles/profile14.webp"),
  "profile15.webp": require("../../assets/images/profiles/profile15.webp"),
  "profile16.webp": require("../../assets/images/profiles/profile16.webp"),
  "profile17.webp": require("../../assets/images/profiles/profile17.webp"),
  "profile18.webp": require("../../assets/images/profiles/profile18.webp"),
  "profile19.webp": require("../../assets/images/profiles/profile19.webp"),
  "profile20.webp": require("../../assets/images/profiles/profile20.webp"),
  "profile21.webp": require("../../assets/images/profiles/profile21.webp"),
  "profile22.webp": require("../../assets/images/profiles/profile22.webp"),
  "profile23.webp": require("../../assets/images/profiles/profile23.webp"),
  "profile4.webp": require("../../assets/images/profiles/profile4.webp"),
  "profile5.webp": require("../../assets/images/profiles/profile5.webp"),
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
  imagePath?: string,
): ImageSourcePropType {
  const filename = imagePath?.trim().split("/").pop()?.split("?")[0];
  if (filename && isBundledProfileImagePath(filename)) {
    return PROFILE_IMAGE_SOURCES[filename];
  }

  return PROFILE_IMAGE_SOURCES[pickDefaultProfileImage()];
}

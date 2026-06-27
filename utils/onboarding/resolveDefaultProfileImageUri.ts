import { Image } from "react-native";

import { defaultProfileImageSource } from "@/constants/onboarding/defaultProfileImages";
import type { ProfileSex } from "@/types/onboarding/onboarding";

/** Local file URI for the bundled default avatar (offline / pre-upload display). */
export function resolveDefaultProfileImageUri(
  sex: ProfileSex | undefined,
  imagePath?: string,
): string {
  const source = defaultProfileImageSource(sex, imagePath);
  const resolved = Image.resolveAssetSource(source);
  return resolved.uri;
}

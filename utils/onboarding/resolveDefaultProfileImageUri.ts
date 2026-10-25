import { Image } from "react-native";

import { defaultProfileImageSource } from "@/constants/onboarding/defaultProfileImages";

/** Local file URI for the bundled default avatar (offline / pre-upload display). */
export function resolveDefaultProfileImageUri(
  imagePath?: string,
): string {
  const source = defaultProfileImageSource(imagePath);
  const resolved = Image.resolveAssetSource(source);
  return resolved.uri;
}

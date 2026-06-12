import type { ImageSourcePropType } from "react-native";

import { getPostImage } from "@/constants/postImages";
import type { PostMedia } from "@/types/community";

export function resolvePostMediaSource(media: PostMedia): ImageSourcePropType {
  if (media.localUri) return { uri: media.localUri };
  return getPostImage(media.imageKey);
}

import type { ImageSourcePropType } from "react-native";

import { getPostImage } from "@/constants/community/postImages";
import type { PostMedia } from "@/types/community/community";

export function resolvePostMediaSource(media: PostMedia): ImageSourcePropType {
  if (media.localUri) return { uri: media.localUri };
  return getPostImage(media.imageKey);
}

export function resolvePostMediaUri(media: PostMedia): string | null {
  if (media.localUri) return media.localUri;
  const source = getPostImage(media.imageKey);
  if (typeof source === "object" && source && "uri" in source && source.uri) {
    return source.uri;
  }
  return null;
}

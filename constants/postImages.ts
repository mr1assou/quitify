import type { ImageSourcePropType } from "react-native";

/** Shared placeholder media for community posts until per-post art exists. */
export const DEFAULT_POST_IMAGE = require("../assets/images/posts/post.png");

const POST_IMAGES: Partial<Record<string, ImageSourcePropType>> = {
  default: DEFAULT_POST_IMAGE,
};

export function getPostImage(key?: string): ImageSourcePropType {
  if (!key) return DEFAULT_POST_IMAGE;
  return POST_IMAGES[key] ?? DEFAULT_POST_IMAGE;
}

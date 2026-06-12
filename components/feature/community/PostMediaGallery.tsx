import type { PostMedia } from "@/types/community";

import { PostMedia as PostMediaItem } from "./PostMedia";
import { PostMediaCarousel } from "./PostMediaCarousel";
import { PostMediaGrid } from "./PostMediaGrid";

export type PostMediaGalleryVariant = "feed" | "detail";

type Props = {
  media: PostMedia[];
  variant?: PostMediaGalleryVariant;
};

export function PostMediaGallery({ media, variant = "feed" }: Props) {
  if (media.length === 0) return null;

  if (variant === "detail") {
    return <PostMediaCarousel media={media} />;
  }

  if (media.length === 1) {
    return <PostMediaItem media={media[0]} />;
  }

  return <PostMediaGrid media={media} />;
}

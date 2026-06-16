import type { PostMedia, PostMediaFrame } from "@/types/community/community";

export const POST_MEDIA_PORTRAIT_RATIO = 4 / 6;

const FRAME_RATIO: Record<PostMediaFrame, number> = {
  square: 1,
  portrait: POST_MEDIA_PORTRAIT_RATIO,
  landscape: 16 / 9,
};

export function resolvePostMediaAspectRatio(media: PostMedia): number {
  const frame = media.frame ?? "portrait";
  return FRAME_RATIO[frame];
}

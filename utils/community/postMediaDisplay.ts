import type { PostMedia } from "@/types/community";

export const FEED_GRID_HEIGHT = 280;
export const FEED_GRID_GAP = 2;

export function isRemotePostMediaUri(uri: string): boolean {
  return /^https?:\/\//i.test(uri);
}

/** Apply the same crop framing as the composer whenever the post has a remote/local URI. */
export function shouldApplyPostMediaCrop(media: PostMedia): boolean {
  return Boolean(media.localUri);
}

/** Stable list keys for post media items. */
export function postMediaKey(media: PostMedia, index: number): string {
  return `${media.localUri ?? media.imageKey ?? "media"}-${index}`;
}

/** Feed overlay when only the first image is shown, e.g. 3 images → "+2". */
export function feedOverflowLabel(totalImages: number): string {
  return `+${totalImages - 1}`;
}

import type { PostTagId } from "@/constants/community/postTags";
import type { CommunityPost, PostImageCrop, PostMedia, PostMediaFrame, PostMediaKind } from "@/types/community/community";
import type { BackendPostResponse } from "@/types/community/postsApi";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

/** Merge API update response into an existing community post (keeps engagement fields). */
export function mergeUpdatedPost(
  existing: CommunityPost,
  updated: BackendPostResponse,
): CommunityPost {
  return {
    ...existing,
    title: updated.title,
    text: updated.description,
    tagId: (updated.tag_id as PostTagId | null) ?? existing.tagId,
    createdAt: new Date(updated.created_at).getTime(),
    media: updated.image_url
      ? [
          {
            kind: (updated.media_kind === "video"
              ? "video"
              : "image") satisfies PostMediaKind,
            localUri: updated.image_url,
            frame: (updated.image_frame as PostMediaFrame | null) ?? undefined,
            crop:
              updated.media_kind === "video"
                ? undefined
                : ((updated.image_crop as PostImageCrop | null) ?? undefined),
            durationLabel:
              updated.media_kind === "video" && updated.media_duration_ms
                ? formatMediaDuration(updated.media_duration_ms)
                : undefined,
          } satisfies PostMedia,
        ]
      : undefined,
  };
}

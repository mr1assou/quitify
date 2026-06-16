import type { PostTagId } from "@/constants/community/postTags";
import type { CommunityPost, PostImageCrop, PostMediaFrame } from "@/types/community/community";
import type { BackendPostResponse } from "@/types/community/postsApi";

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
            kind: "image",
            localUri: updated.image_url,
            frame: (updated.image_frame as PostMediaFrame | null) ?? undefined,
            crop: (updated.image_crop as PostImageCrop | null) ?? undefined,
          },
        ]
      : undefined,
  };
}

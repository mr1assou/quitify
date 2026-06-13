import type { PostTagId } from "@/constants/postTags";
import type { CommunityPost, PostImageCrop, PostMedia, PostMediaFrame } from "@/types/community";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";

export type PostDraftImage = {
  id: string;
  uri: string;
  mimeType?: string | null;
  frame: PostMediaFrame;
  crop: PostImageCrop;
};

export type PostDraft = {
  title: string;
  body: string;
  tagId: PostTagId | null;
  images: PostDraftImage[];
};

export const EMPTY_POST_DRAFT: PostDraft = {
  title: "",
  body: "",
  tagId: null,
  images: [],
};

export function createDraftImage(
  uri: string,
  mimeType?: string | null,
  frame: PostMediaFrame = "portrait",
  crop: PostImageCrop = DEFAULT_POST_IMAGE_CROP,
): PostDraftImage {
  return {
    id: `draft-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    uri,
    mimeType,
    frame,
    crop,
  };
}

export function postDraftFromCommunityPost(post: CommunityPost): PostDraft {
  const media = post.media?.[0];

  return {
    title: post.title ?? "",
    body: post.text,
    tagId: post.tagId ?? null,
    images: media?.localUri
      ? [
          createDraftImage(
            media.localUri,
            null,
            media.frame ?? "portrait",
            media.crop ?? DEFAULT_POST_IMAGE_CROP,
          ),
        ]
      : [],
  };
}

export function buildPostMediaList(draft: PostDraft): PostMedia[] | undefined {
  if (draft.images.length === 0) return undefined;
  return draft.images.map((image) => ({
    kind: "image" as const,
    localUri: image.uri,
    frame: image.frame,
    crop: image.crop,
  }));
}

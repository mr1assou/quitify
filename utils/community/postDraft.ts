import type { PostTagId } from "@/constants/community/postTags";
import type {
  CommunityPost,
  PostImageCrop,
  PostMedia,
  PostMediaFrame,
  PostMediaKind,
} from "@/types/community/community";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";
import { formatMediaDuration } from "@/utils/chat/formatMediaDuration";

export type PostDraftImage = {
  id: string;
  uri: string;
  kind: PostMediaKind;
  mimeType?: string | null;
  durationMs?: number;
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
  kind: PostMediaKind = "image",
  durationMs?: number,
  frame: PostMediaFrame = "portrait",
  crop: PostImageCrop = DEFAULT_POST_IMAGE_CROP,
): PostDraftImage {
  return {
    id: `draft-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    uri,
    kind,
    mimeType,
    durationMs,
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
            media.kind,
            undefined,
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
    kind: image.kind,
    localUri: image.uri,
    frame: image.frame,
    crop: image.kind === "image" ? image.crop : undefined,
    durationLabel:
      image.kind === "video" && image.durationMs
        ? formatMediaDuration(image.durationMs)
        : undefined,
  }));
}

import type { PostTagId } from "@/constants/postTags";
import type { PostImageCrop, PostMedia, PostMediaFrame } from "@/types/community";
import { DEFAULT_POST_IMAGE_CROP } from "@/utils/community/postImageCrop";

export type PostDraftImage = {
  id: string;
  uri: string;
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

export function createDraftImage(uri: string, frame: PostMediaFrame = "portrait"): PostDraftImage {
  return {
    id: `draft-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    uri,
    frame,
    crop: DEFAULT_POST_IMAGE_CROP,
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

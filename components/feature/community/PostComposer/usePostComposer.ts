import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { useCommunity } from "@/context/CommunityContext";
import type { PostImageCrop, PostMediaFrame } from "@/types/community";
import {
  buildPostMediaList,
  createDraftImage,
  EMPTY_POST_DRAFT,
  type PostDraft,
} from "@/utils/community/postDraft";

import { usePickPostImage } from "./usePickPostImage";

export function usePostComposer() {
  const { addPost } = useCommunity();
  const [draft, setDraft] = useState<PostDraft>(EMPTY_POST_DRAFT);
  const { pickImages } = usePickPostImage();

  const canPost = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  const updateDraft = useCallback((patch: Partial<PostDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const addImages = useCallback(async () => {
    const uris = await pickImages();
    if (uris.length === 0) return;

    setDraft((current) => ({
      ...current,
      images: [...current.images, ...uris.map((uri) => createDraftImage(uri))],
    }));
  }, [pickImages]);

  const removeImage = useCallback((id: string) => {
    setDraft((current) => ({
      ...current,
      images: current.images.filter((image) => image.id !== id),
    }));
  }, []);

  const updateImageFrame = useCallback((id: string, frame: PostMediaFrame) => {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image) =>
        image.id === id ? { ...image, frame } : image,
      ),
    }));
  }, []);

  const updateImageCrop = useCallback((id: string, crop: PostImageCrop) => {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image) =>
        image.id === id ? { ...image, crop } : image,
      ),
    }));
  }, []);

  const onPost = useCallback(() => {
    if (!canPost) return;

    addPost({
      title: draft.title.trim(),
      text: draft.body.trim(),
      tagId: draft.tagId ?? undefined,
      media: buildPostMediaList(draft),
    });

    setDraft(EMPTY_POST_DRAFT);
    router.back();
  }, [addPost, canPost, draft]);

  return {
    draft,
    updateDraft,
    addImages,
    removeImage,
    updateImageFrame,
    updateImageCrop,
    canPost,
    onPost,
  };
}

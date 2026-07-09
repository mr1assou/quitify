import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { createPost } from "@/services/posts/postsApi";
import { uploadPostMediaToR2 } from "@/services/posts/uploadPostMedia";
import { mapBackendPostToCommunityPost } from "@/utils/community/mapBackendPost";
import type { PostImageCrop, PostMediaFrame } from "@/types/community/community";
import type { UpdatePostPayload } from "@/types/community/updatePost";
import {
  createDraftImage,
  EMPTY_POST_DRAFT,
  postDraftFromCommunityPost,
  type PostDraft,
} from "@/utils/community/postDraft";
import { buildCurrentUserCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";

import { usePickPostMedia } from "./usePickPostMedia";
import type { PostImageCropEditorHandle } from "./PostImageCropEditor";

function isRemoteUri(uri: string): boolean {
  return /^https?:\/\//i.test(uri);
}

export function usePostComposer() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editingPostId = typeof editId === "string" ? editId : undefined;
  const { addPost, updatePost, state } = useCommunity();
  const { state: appState } = useApp();
  const { requirePremium } = usePremiumGate();
  const [draft, setDraft] = useState<PostDraft>(EMPTY_POST_DRAFT);
  const [isPosting, setIsPosting] = useState(false);
  const { pickMedia } = usePickPostMedia();
  const cropEditorRef = useRef<PostImageCropEditorHandle | null>(null);

  useEffect(() => {
    if (!editingPostId) {
      setDraft(EMPTY_POST_DRAFT);
      return;
    }
    const post = state.posts.find((item) => item.id === editingPostId);
    if (post) {
      setDraft(postDraftFromCommunityPost(post));
    }
  }, [editingPostId, state.posts]);

  const isEditing = Boolean(editingPostId);

  const canPost = useMemo(
    () => draft.title.trim().length > 0 && draft.tagId != null && !isPosting,
    [draft.title, draft.tagId, isPosting],
  );

  const updateDraft = useCallback((patch: Partial<PostDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const addMedia = useCallback(async () => {
    const picked = await pickMedia();
    if (picked.length === 0) return;

    setDraft((current) => {
      if (current.images.length >= 1) return current;
      const item = picked[0];
      return {
        ...current,
        images: [
          createDraftImage(
            item.uri,
            item.mimeType,
            item.kind,
            item.durationMs,
          ),
        ],
      };
    });
  }, [pickMedia]);

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
        image.id === id && image.kind === "image" ? { ...image, crop } : image,
      ),
    }));
  }, []);

  const onPost = useCallback(async () => {
    if (!canPost || !draft.tagId) return;
    if (!isEditing && !requirePremium()) return;

    const title = draft.title.trim();
    const description = draft.body.trim();
    let media = draft.images[0];
    const tagId = draft.tagId;

    if (media?.kind === "image") {
      const flushedCrop = cropEditorRef.current?.flush();
      if (flushedCrop) {
        media = { ...media, crop: flushedCrop };
      }
    }

    const originalPost = editingPostId
      ? state.posts.find((item) => item.id === editingPostId)
      : undefined;
    const hadMedia = Boolean(originalPost?.media?.length);

    setIsPosting(true);
    try {
      let imageUrl: string | undefined;
      let imageFrame: PostMediaFrame | undefined;
      let imageCrop: PostImageCrop | undefined;
      let mediaKind: "image" | "video" | undefined;
      let mediaDurationMs: number | undefined;
      let clearImage = false;

      if (media) {
        mediaKind = media.kind;
        imageFrame = media.frame;
        mediaDurationMs = media.durationMs;

        if (isRemoteUri(media.uri)) {
          imageUrl = media.uri;
          if (media.kind === "image") {
            imageCrop = media.crop;
          }
        } else {
          const uploaded = await uploadPostMediaToR2({
            uri: media.uri,
            kind: media.kind,
            mimeType: media.mimeType,
          });
          imageUrl = uploaded.publicUrl;
          if (media.kind === "image") {
            imageCrop = media.crop;
          }
        }
      } else if (isEditing && hadMedia) {
        clearImage = true;
      }

      if (isEditing && editingPostId) {
        const payload: UpdatePostPayload = {
          title,
          description: description || undefined,
          tag_id: tagId,
        };
        if (clearImage) {
          payload.image_url = null;
          payload.image_frame = null;
          payload.image_crop = null;
          payload.media_kind = null;
          payload.media_duration_ms = null;
        } else if (imageUrl) {
          payload.image_url = imageUrl;
          payload.image_frame = imageFrame;
          payload.image_crop = mediaKind === "image" ? (imageCrop ?? null) : null;
          payload.media_kind = mediaKind;
          payload.media_duration_ms = mediaDurationMs ?? null;
        }
        await updatePost(editingPostId, payload);
        router.back();
        return;
      }

      const created = await createPost({
        title,
        description: description || undefined,
        tag_id: tagId,
        image_url: imageUrl,
        image_frame: imageFrame,
        image_crop: mediaKind === "image" ? imageCrop : undefined,
        media_kind: mediaKind,
        media_duration_ms: mediaDurationMs,
      });

      let post = mapBackendPostToCommunityPost(created);
      if (media && post.media?.[0]) {
        post = {
          ...post,
          media: [
            {
              ...post.media[0],
              frame: post.media[0].frame ?? media.frame,
              crop: media.kind === "image" ? (post.media[0].crop ?? media.crop) : undefined,
              durationLabel: post.media[0].durationLabel,
            },
          ],
        };
      }
      addPost(
        post,
        buildCurrentUserCommunityAuthor(
          appState.profile,
          appState.account?.name,
          appState.account?.userId,
        ),
      );
      setDraft(EMPTY_POST_DRAFT);
      router.back();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      Alert.alert(isEditing ? "Could not save" : "Could not post", message);
    } finally {
      setIsPosting(false);
    }
  }, [
    addPost,
    appState.account?.name,
    appState.account?.userId,
    appState.profile,
    canPost,
    draft,
    editingPostId,
    isEditing,
    requirePremium,
    state.posts,
    updatePost,
  ]);

  return {
    draft,
    updateDraft,
    addMedia,
    removeImage,
    updateImageFrame,
    updateImageCrop,
    canPost,
    isPosting,
    isEditing,
    onPost,
    cropEditorRef,
  };
}

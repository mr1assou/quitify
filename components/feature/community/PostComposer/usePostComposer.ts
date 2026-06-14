import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import {
  createPost,
  requestPostUploadUrl,
  uploadImageToPresignedUrl,
} from "@/services/posts/postsApi";
import { mapBackendPostToCommunityPost } from "@/utils/community/mapBackendPost";
import type { PostImageCrop, PostMediaFrame } from "@/types/community";
import type { UpdatePostPayload } from "@/types/updatePost";
import {
  createDraftImage,
  EMPTY_POST_DRAFT,
  postDraftFromCommunityPost,
  type PostDraft,
} from "@/utils/community/postDraft";
import { optimizePostImageForUpload } from "@/utils/posts/optimizePostImage";
import { buildCurrentUserCommunityAuthor } from "@/utils/community/resolveCommunityAuthor";

import { usePickPostImage } from "./usePickPostImage";

function isRemoteUri(uri: string): boolean {
  return /^https?:\/\//i.test(uri);
}

export function usePostComposer() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editingPostId = typeof editId === "string" ? editId : undefined;
  const { addPost, updatePost, state } = useCommunity();
  const { state: appState } = useApp();
  const [draft, setDraft] = useState<PostDraft>(EMPTY_POST_DRAFT);
  const [isPosting, setIsPosting] = useState(false);
  const { pickImages } = usePickPostImage();

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

  const addImages = useCallback(async () => {
    const picked = await pickImages();
    if (picked.length === 0) return;

    setDraft((current) => {
      if (current.images.length >= 1) return current;
      const { uri, mimeType } = picked[0];
      return {
        ...current,
        images: [createDraftImage(uri, mimeType)],
      };
    });
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

  const onPost = useCallback(async () => {
    if (!canPost || !draft.tagId) return;

    const title = draft.title.trim();
    const description = draft.body.trim();
    const image = draft.images[0];
    const tagId = draft.tagId;

    const originalPost = editingPostId
      ? state.posts.find((item) => item.id === editingPostId)
      : undefined;
    const hadImage = Boolean(originalPost?.media?.length);

    setIsPosting(true);
    try {
      let imageUrl: string | undefined;
      let imageFrame: PostMediaFrame | undefined;
      let imageCrop: PostImageCrop | undefined;
      let clearImage = false;

      if (image) {
        if (isRemoteUri(image.uri)) {
          imageUrl = image.uri;
          imageFrame = image.frame;
          imageCrop = image.crop;
        } else {
          const optimized = await optimizePostImageForUpload(
            image.uri,
            image.frame,
            image.crop,
          );
          const { uploadUrl, imageUrl: uploadedUrl } = await requestPostUploadUrl(
            optimized.contentType,
          );
          await uploadImageToPresignedUrl(uploadUrl, optimized.uri, optimized.contentType);
          imageUrl = uploadedUrl;
          imageFrame = image.frame;
          imageCrop = image.crop;
        }
      } else if (isEditing && hadImage) {
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
        } else if (imageUrl) {
          payload.image_url = imageUrl;
          payload.image_frame = imageFrame;
          payload.image_crop = imageCrop;
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
        image_crop: imageCrop,
      });

      const post = mapBackendPostToCommunityPost(created);
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
  }, [addPost, appState.account?.name, appState.profile, canPost, draft, editingPostId, isEditing, updatePost]);

  return {
    draft,
    updateDraft,
    addImages,
    removeImage,
    updateImageFrame,
    updateImageCrop,
    canPost,
    isPosting,
    isEditing,
    onPost,
  };
}

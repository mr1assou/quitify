import type { PostImageCrop, PostMediaFrame, PostMediaKind, PostTagId } from "@/types/community/community";
import type { CreatePostPayload } from "@/types/community/postsApi";

export type UpdatePostPayload = Partial<CreatePostPayload> & {
  image_url?: string | null;
  image_frame?: PostMediaFrame | null;
  image_crop?: PostImageCrop | null;
  media_kind?: PostMediaKind | null;
  media_duration_ms?: number | null;
  tag_id?: PostTagId;
};

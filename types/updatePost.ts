import type { PostImageCrop, PostMediaFrame, PostTagId } from "@/types/community";
import type { CreatePostPayload } from "@/types/postsApi";

export type UpdatePostPayload = Partial<CreatePostPayload> & {
  image_url?: string | null;
  image_frame?: PostMediaFrame | null;
  image_crop?: PostImageCrop | null;
  tag_id?: PostTagId;
};

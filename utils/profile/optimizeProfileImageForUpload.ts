import {
  PROFILE_IMAGE_FRAME,
  PROFILE_UPLOAD_JPEG_QUALITY,
  PROFILE_UPLOAD_MAX_LONG_EDGE,
} from "@/constants/profileImage";
import type { PostImageCrop } from "@/types/community";
import { optimizePostImageForUpload } from "@/utils/posts/optimizePostImage";

export function optimizeProfileImageForUpload(uri: string, crop: PostImageCrop) {
  return optimizePostImageForUpload(
    uri,
    PROFILE_IMAGE_FRAME,
    crop,
    PROFILE_UPLOAD_MAX_LONG_EDGE,
    PROFILE_UPLOAD_JPEG_QUALITY,
  );
}

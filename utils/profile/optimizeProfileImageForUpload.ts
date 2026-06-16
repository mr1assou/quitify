import {
  PROFILE_IMAGE_FRAME,
  PROFILE_UPLOAD_JPEG_QUALITY,
  PROFILE_UPLOAD_MAX_LONG_EDGE,
} from "@/constants/profile/profileImage";
import type { PostImageCrop } from "@/types/community/community";
import { optimizePostImageWithCropForUpload } from "@/utils/posts/optimizePostImage";

export function optimizeProfileImageForUpload(uri: string, crop: PostImageCrop) {
  return optimizePostImageWithCropForUpload(
    uri,
    PROFILE_IMAGE_FRAME,
    crop,
    PROFILE_UPLOAD_MAX_LONG_EDGE,
    PROFILE_UPLOAD_JPEG_QUALITY,
  );
}

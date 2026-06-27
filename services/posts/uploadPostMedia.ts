import { requestPostUploadUrl, uploadImageToPresignedUrl } from "@/services/posts/postsApi";
import {
  isVideoContentType,
  resolvePostMediaContentType,
  type PostMediaContentType,
} from "@/utils/posts/resolvePostMediaContentType";
import { optimizePostImageForUpload } from "@/utils/posts/optimizePostImage";

export async function uploadPostMediaToR2(input: {
  uri: string;
  kind: "image" | "video";
  mimeType?: string | null;
}): Promise<{ publicUrl: string; contentType: PostMediaContentType }> {
  if (input.kind === "image") {
    const optimized = await optimizePostImageForUpload(input.uri);
    const { uploadUrl, imageUrl } = await requestPostUploadUrl(optimized.contentType);
    await uploadImageToPresignedUrl(uploadUrl, optimized.uri, optimized.contentType);
    return { publicUrl: imageUrl, contentType: optimized.contentType };
  }

  const contentType = resolvePostMediaContentType("video", input.mimeType, input.uri);
  const { uploadUrl, imageUrl } = await requestPostUploadUrl(contentType);
  const fileResponse = await fetch(input.uri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }

  if (!isVideoContentType(contentType)) {
    throw new Error("Unsupported video type");
  }

  return { publicUrl: imageUrl, contentType };
}

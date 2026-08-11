import { requestPostUploadUrl, uploadImageToPresignedUrl } from "@/services/posts/postsApi";
import {
  isVideoContentType,
  resolvePostMediaContentType,
  type PostMediaContentType,
} from "@/utils/posts/resolvePostMediaContentType";
import { optimizePostImageForUpload } from "@/utils/posts/optimizePostImage";
import { getLocalFileSizeBytes } from "@/utils/media/getLocalFileSizeBytes";
import {
  assertNoViolation,
  postImageTooLarge,
  postVideoTooLarge,
  postVideoTooLong,
} from "@/utils/media/validateMediaLimits";
import { POST_VIDEO_MAX_DURATION_MS } from "@/constants/media/uploadLimits";

function normalizeVideoDurationMs(durationMs: number | undefined): number | undefined {
  if (durationMs == null || !Number.isFinite(durationMs) || durationMs <= 0) {
    return undefined;
  }
  // Some Android builds report seconds for short clips.
  const ms = durationMs <= 180 ? durationMs * 1000 : durationMs;
  return Math.min(ms, POST_VIDEO_MAX_DURATION_MS * 2);
}

export async function uploadPostMediaToR2(input: {
  uri: string;
  kind: "image" | "video";
  mimeType?: string | null;
  durationMs?: number;
}): Promise<{ publicUrl: string; contentType: PostMediaContentType }> {
  if (input.kind === "image") {
    const optimized = await optimizePostImageForUpload(input.uri);
    const sizeBytes = await getLocalFileSizeBytes(optimized.uri);
    if (sizeBytes != null) {
      assertNoViolation(postImageTooLarge(sizeBytes));
    } else {
      throw new Error("Could not read image size. Try another photo.");
    }

    const { uploadUrl, imageUrl } = await requestPostUploadUrl(
      optimized.contentType,
      sizeBytes,
    );
    await uploadImageToPresignedUrl(uploadUrl, optimized.uri, optimized.contentType);
    return { publicUrl: imageUrl, contentType: optimized.contentType };
  }

  const durationMs = normalizeVideoDurationMs(input.durationMs);
  assertNoViolation(postVideoTooLong(durationMs));

  const contentType = resolvePostMediaContentType("video", input.mimeType, input.uri);
  const fileResponse = await fetch(input.uri);
  const blob = await fileResponse.blob();
  assertNoViolation(postVideoTooLarge(blob.size));

  if (durationMs == null) {
    throw new Error("Could not read video duration. Try another video.");
  }
  if (durationMs > POST_VIDEO_MAX_DURATION_MS) {
    assertNoViolation(postVideoTooLong(durationMs));
  }

  const { uploadUrl, imageUrl } = await requestPostUploadUrl(
    contentType,
    blob.size,
    durationMs,
  );

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

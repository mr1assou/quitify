import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import { uploadImageToPresignedUrl } from "@/services/posts/postsApi";
import type { AllowedImageContentType, PresignedUploadResponse } from "@/types/community/postsApi";
import { getLocalFileSizeBytes } from "@/utils/media/getLocalFileSizeBytes";
import { assertNoViolation, profileImageTooLarge } from "@/utils/media/validateMediaLimits";

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message[0] ?? fallback;
    if (body.message) return body.message;
  } catch {
    // ignore
  }
  return fallback;
}

export async function requestProfileUploadUrl(
  contentType: AllowedImageContentType,
  fileSizeBytes: number,
): Promise<PresignedUploadResponse> {
  const res = await authenticatedFetch("/profile/upload-url", {
    method: "POST",
    body: JSON.stringify({ contentType, fileSizeBytes }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not prepare profile photo upload"));
  }

  return res.json() as Promise<PresignedUploadResponse>;
}

export async function updateProfileImage(imageUrl: string): Promise<{ image_url: string }> {
  const res = await authenticatedFetch("/auth/me/profile-image", {
    method: "PATCH",
    body: JSON.stringify({ image_url: imageUrl }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, "Could not update profile photo"));
  }

  return res.json() as Promise<{ image_url: string }>;
}

export async function uploadProfileImage(
  localUri: string,
  contentType: AllowedImageContentType,
): Promise<string> {
  const sizeBytes = await getLocalFileSizeBytes(localUri);
  if (sizeBytes == null) {
    throw new Error("Could not read photo size. Try another image.");
  }
  assertNoViolation(profileImageTooLarge(sizeBytes));

  const { uploadUrl, imageUrl } = await requestProfileUploadUrl(contentType, sizeBytes);
  await uploadImageToPresignedUrl(uploadUrl, localUri, contentType);
  return imageUrl;
}

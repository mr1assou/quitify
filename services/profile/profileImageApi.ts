import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import { uploadImageToPresignedUrl } from "@/services/posts/postsApi";
import type { AllowedImageContentType, PresignedUploadResponse } from "@/types/postsApi";

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
): Promise<PresignedUploadResponse> {
  const res = await authenticatedFetch("/profile/upload-url", {
    method: "POST",
    body: JSON.stringify({ contentType }),
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
  const { uploadUrl, imageUrl } = await requestProfileUploadUrl(contentType);
  await uploadImageToPresignedUrl(uploadUrl, localUri, contentType);
  return imageUrl;
}

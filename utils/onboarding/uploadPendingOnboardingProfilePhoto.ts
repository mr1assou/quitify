import {
  updateProfileImage,
  uploadProfileImage,
} from "@/services/profile/profileImageApi";

/**
 * If the user selected a local profile photo during onboarding,
 * uploads it to R2 and sets it via `PATCH /auth/me/profile-image`.
 * Returns the uploaded R2 URL, or undefined if no local image was pending.
 */
export async function uploadPendingOnboardingProfilePhoto(
  localImageUri?: string,
): Promise<string | undefined> {
  const trimmed = localImageUri?.trim();
  if (!trimmed) return undefined;

  // If it's already an HTTP / HTTPS URL, it was already uploaded
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  try {
    const uploadedUrl = await uploadProfileImage(trimmed, "image/jpeg");
    await updateProfileImage(uploadedUrl);
    return uploadedUrl;
  } catch (error) {
    // Non-fatal: if photo upload fails, onboarding still finishes
    console.warn("Could not upload onboarding profile photo:", error);
    return undefined;
  }
}

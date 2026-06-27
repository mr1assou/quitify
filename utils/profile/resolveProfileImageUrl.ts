import {
  defaultProfileImagePath,
  isDefaultProfileImagePath,
} from "@/utils/profile/resolveAvatarImageSource";
import type { ProfileSex } from "@/types/onboarding/onboarding";

/**
 * User-uploaded avatars use the server URL (R2).
 * Default avatars use `profile1.webp` / `profile2.webp` in the DB.
 */
export function resolveProfileImageUrl(
  serverImageUrl: string | undefined | null,
  sex?: ProfileSex,
): string | undefined {
  const trimmed = serverImageUrl?.trim();
  if (trimmed) return trimmed;

  if (!sex) return undefined;
  return defaultProfileImagePath(sex);
}

export { isDefaultProfileImagePath };

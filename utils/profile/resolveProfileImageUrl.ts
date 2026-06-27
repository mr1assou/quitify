import { pickDefaultProfileImageForSex } from "@/utils/profile/pickDefaultProfileImage";
import {
  isDefaultProfileImagePath,
} from "@/utils/profile/resolveAvatarImageSource";
import type { ProfileSex } from "@/types/onboarding/onboarding";

/**
 * User-uploaded avatars use the server URL (R2).
 * Default avatars use bundled `profile*.webp` filenames in the DB.
 */
export function resolveProfileImageUrl(
  serverImageUrl: string | undefined | null,
  sex?: ProfileSex,
): string | undefined {
  const trimmed = serverImageUrl?.trim();
  if (trimmed) return trimmed;

  if (!sex) return undefined;
  return pickDefaultProfileImageForSex(sex);
}

export { isDefaultProfileImagePath };

import {
  isDefaultProfileImagePath,
} from "@/utils/profile/resolveAvatarImageSource";

/**
 * User-uploaded avatars use the server URL (R2).
 * Default avatars use bundled `profile*.webp` filenames in the DB.
 */
export function resolveProfileImageUrl(
  serverImageUrl: string | undefined | null,
): string | undefined {
  const trimmed = serverImageUrl?.trim();
  return trimmed || undefined;
}

export { isDefaultProfileImagePath };

import { resolveDefaultProfileImageUri } from "@/utils/onboarding/resolveDefaultProfileImageUri";
import type { ProfileSex } from "@/types/onboarding/onboarding";

/**
 * User-uploaded avatars use the server URL (R2). Default avatars are bundled in
 * `assets/images/profiles/` and are not copied to R2 on signup.
 */
export function resolveProfileImageUrl(
  serverImageUrl: string | undefined | null,
  sex?: ProfileSex,
): string | undefined {
  const trimmed = serverImageUrl?.trim();
  if (trimmed) return trimmed;

  if (!sex) return undefined;
  return resolveDefaultProfileImageUri(sex);
}

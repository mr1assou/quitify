import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { parseDbUserId } from "@/utils/community/presence";

export function resolveProfileUserId(
  profile: PlayerProfile | null | undefined,
  accountUserId?: number,
): number | null {
  if (!profile) return null;

  if (profile.userId && profile.userId > 0) return profile.userId;

  if (profile.isCurrentUser && accountUserId && accountUserId > 0) {
    return accountUserId;
  }

  const fromProfileId = parseDbUserId(profile.id);
  if (fromProfileId) return fromProfileId;

  return null;
}

export function resolveProfileCommunityUserId(profile: PlayerProfile): string {
  if (profile.isCurrentUser) return CURRENT_USER_ID;

  const userId = resolveProfileUserId(profile);
  if (userId) return `db-${userId}`;

  const communityUserId = profile.id.startsWith("cu:") ? profile.id.slice(3) : null;
  if (communityUserId) return communityUserId;

  return profile.id;
}

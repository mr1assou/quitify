import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { parseDbUserId } from "@/utils/community/presence";
import { parseCommunityProfileId } from "@/utils/profile/communityProfileLinks";

export function resolveProfileUserId(
  profile: PlayerProfile | null | undefined,
  accountUserId?: number,
): number | null {
  if (!profile) return null;

  if (profile.userId && profile.userId > 0) return profile.userId;

  if (profile.isCurrentUser && accountUserId && accountUserId > 0) {
    return accountUserId;
  }

  // Direct db-123 profile ids
  const fromProfileId = parseDbUserId(profile.id);
  if (fromProfileId) return fromProfileId;

  // Community profile wrapper cu:db-123 (post/comment authors)
  const communityUserId = parseCommunityProfileId(profile.id);
  if (communityUserId) {
    const fromCommunity = parseDbUserId(communityUserId);
    if (fromCommunity) return fromCommunity;
  }

  return null;
}

export function resolveProfileCommunityUserId(profile: PlayerProfile): string {
  if (profile.isCurrentUser) return CURRENT_USER_ID;

  const userId = resolveProfileUserId(profile);
  if (userId) return `db-${userId}`;

  const communityUserId = parseCommunityProfileId(profile.id);
  if (communityUserId) return communityUserId;

  return profile.id;
}

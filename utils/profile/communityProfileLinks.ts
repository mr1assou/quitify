import { COMMUNITY_USERS, CURRENT_USER_ID } from "@/constants/communityUsers";
import type { PlayerProfile } from "@/types/playerProfile";

const COMMUNITY_PROFILE_PREFIX = "cu:";
const OTHER_COMMUNITY_USERS = COMMUNITY_USERS.filter((user) => !user.isCurrentUser);

export function toCommunityProfileId(communityUserId: string): string {
  return `${COMMUNITY_PROFILE_PREFIX}${communityUserId}`;
}

export function parseCommunityProfileId(profileId: string): string | null {
  if (!profileId.startsWith(COMMUNITY_PROFILE_PREFIX)) return null;
  return profileId.slice(COMMUNITY_PROFILE_PREFIX.length);
}

export function resolveProfileCommunityUserId(profile: PlayerProfile): string {
  if (profile.isCurrentUser) return CURRENT_USER_ID;

  const communityUserId = parseCommunityProfileId(profile.id);
  if (communityUserId) return communityUserId;

  const index = Math.abs(profile.rank - 1) % OTHER_COMMUNITY_USERS.length;
  return OTHER_COMMUNITY_USERS[index].id;
}

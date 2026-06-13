export {
  resolveProfileCommunityUserId,
  resolveProfileUserId,
} from "./resolveProfileUserId";

const COMMUNITY_PROFILE_PREFIX = "cu:";

export function toCommunityProfileId(communityUserId: string): string {
  return `${COMMUNITY_PROFILE_PREFIX}${communityUserId}`;
}

export function parseCommunityProfileId(profileId: string): string | null {
  if (!profileId.startsWith(COMMUNITY_PROFILE_PREFIX)) return null;
  return profileId.slice(COMMUNITY_PROFILE_PREFIX.length);
}

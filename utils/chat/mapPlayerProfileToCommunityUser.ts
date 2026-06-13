import type { CommunityUser } from "@/types/community";
import type { PlayerProfile } from "@/types/playerProfile";

export function mapPlayerProfileToCommunityUser(
  profile: PlayerProfile,
  communityUserId: string,
): CommunityUser {
  const handle =
    profile.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .slice(0, 24) || communityUserId;

  return {
    id: communityUserId,
    name: profile.name,
    handle,
    bio: profile.bio,
    smokeFreeDays: profile.smokeFreeDays,
    badgeId: profile.badgeId,
    avatarUrl: profile.avatarUrl,
    countryFlag: profile.countryFlag,
    avatarRank: profile.rank,
    leaderboardRank: profile.rank,
    isCurrentUser: profile.isCurrentUser,
    isOnline: profile.isOnline,
    location: profile.countryLabel,
  };
}

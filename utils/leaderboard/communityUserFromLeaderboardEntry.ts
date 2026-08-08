import type { CommunityUser } from "@/types/community/community";
import type { LeaderboardEntry } from "@/types/leaderboard/leaderboard";
import { dbAuthorId } from "@/utils/community/presence";
import { estimateSmokeFreeDaysFromXp } from "@/utils/progress/badges";

/** Map a leaderboard row into a CommunityUser so profile screens can resolve it after navigation. */
export function communityUserFromLeaderboardEntry(entry: LeaderboardEntry): CommunityUser | null {
  if (entry.userId == null || entry.isCurrentUser) return null;

  return {
    id: dbAuthorId(entry.userId),
    name: entry.name,
    handle: entry.name.replace(/^@/, ""),
    bio: "",
    smokeFreeDays: estimateSmokeFreeDaysFromXp(entry.xp),
    badgeId: entry.badgeId,
    countryFlag: entry.countryFlag,
    avatarRank: entry.rank,
    leaderboardRank: entry.rank,
    avatarUrl: entry.imageUrl,
    isOnline: entry.isOnline,
    location: entry.countryCode,
  };
}

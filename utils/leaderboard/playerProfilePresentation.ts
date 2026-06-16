import { resolveCountryLabel } from "@/constants/leaderboard/leaderboardCountries";
import type { LeaderboardEntry } from "@/types/leaderboard/leaderboard";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { dbAuthorId } from "@/utils/community/presence";
import { estimateSmokeFreeDaysFromXp } from "@/utils/progress/badges";

const MEMBER_SINCE = [
  "Jan 2024",
  "Mar 2024",
  "May 2024",
  "Jul 2024",
  "Sep 2024",
  "Nov 2024",
  "Feb 2025",
  "Apr 2025",
  "Jun 2025",
  "Aug 2025",
];

function memberSinceLabelForRank(rank: number): string {
  return MEMBER_SINCE[Math.abs(rank - 1) % MEMBER_SINCE.length];
}

export function bestSmokeFreeDaysForRank(currentDays: number, rank: number): number {
  if (currentDays <= 0) return 0;
  const bonusDays = 8 + (rank % 35);
  const stretched = Math.floor(currentDays * (1.12 + (rank % 5) * 0.03));
  return Math.max(currentDays, stretched + bonusDays);
}

type PlayerProfileOverrides = {
  name?: string;
  countryLabel?: string;
  countryFlag?: string;
  countryCode?: string;
  bio?: string;
  avatarUrl?: string;
};

export function buildPlayerProfile(
  entry: LeaderboardEntry,
  totalPlayers: number,
  overrides?: PlayerProfileOverrides,
): PlayerProfile {
  const smokeFreeDays = estimateSmokeFreeDaysFromXp(entry.xp);
  const name = overrides?.name ?? entry.name;

  return {
    id: entry.userId
      ? entry.isCurrentUser
        ? "me"
        : dbAuthorId(entry.userId)
      : entry.isCurrentUser
        ? "me"
        : `lb-${entry.rank}`,
    userId: entry.userId,
    name,
    rank: entry.rank,
    totalPlayers,
    freedomPoints: entry.xp,
    badgeId: entry.badgeId,
    countryFlag: overrides?.countryFlag ?? entry.countryFlag,
    countryLabel:
      overrides?.countryLabel ??
      resolveCountryLabel(overrides?.countryCode ?? entry.countryCode, entry.rank),
    isOnline: entry.isOnline ?? entry.isCurrentUser,
    smokeFreeDays,
    bestSmokeFreeDays: bestSmokeFreeDaysForRank(smokeFreeDays, entry.rank),
    isCurrentUser: entry.isCurrentUser,
    bio: overrides?.bio ?? "",
    memberSinceLabel: memberSinceLabelForRank(entry.rank),
    avatarUrl: overrides?.avatarUrl,
  };
}

import { resolveCountryLabel } from "@/constants/leaderboardCountries";
import type { LeaderboardEntry } from "@/types/leaderboard";
import type { PlayerProfile } from "@/types/playerProfile";
import { estimateSmokeFreeDaysFromXp } from "@/utils/badges";

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

function syntheticBio(name: string, smokeFreeDays: number): string {
  if (smokeFreeDays >= 365) {
    return `${name} is building a long-term smoke-free life and supporting others on the same journey.`;
  }
  if (smokeFreeDays >= 90) {
    return `${name} is staying consistent, earning Freedom points, and climbing the global ranks.`;
  }
  return `${name} is focused on daily progress, healthier habits, and staying accountable.`;
}

export function memberSinceLabelForRank(rank: number): string {
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
};

export function buildPlayerProfile(
  entry: LeaderboardEntry,
  totalPlayers: number,
  overrides?: PlayerProfileOverrides,
): PlayerProfile {
  const smokeFreeDays = estimateSmokeFreeDaysFromXp(entry.xp);
  const name = overrides?.name ?? entry.name;

  return {
    id: entry.isCurrentUser ? "me" : `lb-${entry.rank}`,
    name,
    rank: entry.rank,
    totalPlayers,
    freedomPoints: entry.xp,
    badgeId: entry.badgeId,
    countryFlag: overrides?.countryFlag ?? entry.countryFlag,
    countryLabel:
      overrides?.countryLabel ??
      resolveCountryLabel(overrides?.countryCode, entry.rank),
    smokeFreeDays,
    bestSmokeFreeDays: bestSmokeFreeDaysForRank(smokeFreeDays, entry.rank),
    isCurrentUser: entry.isCurrentUser,
    bio: overrides?.bio ?? syntheticBio(name, smokeFreeDays),
    memberSinceLabel: memberSinceLabelForRank(entry.rank),
  };
}

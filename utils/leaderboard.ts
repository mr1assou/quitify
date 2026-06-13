import { countryFlagForRank } from "@/constants/leaderboardCountries";
import { LEADERBOARD_NAMES } from "@/constants/leaderboardNames";
import { MEDIAN_XP } from "@/constants/ranks";
import type { LeaderboardEntry, LeaderboardRow, LeaderboardSnapshot } from "@/types/leaderboard";
import { resolveBadgeIdForXp } from "@/utils/badges";
import { resolveMockOnlineStatus } from "@/utils/community/mockOnlineStatus";
/** How many players appear in the community list (ranks 1..N). */
export const COMMUNITY_TOP_COUNT = 10;

/** Deterministic display name for a synthetic rank slot. */
export function nameForRank(rank: number): string {
  const i = Math.abs((rank * 7_919 + 104_729) % LEADERBOARD_NAMES.length);
  return LEADERBOARD_NAMES[i];
}

/** XP that would place someone at roughly `rank` out of `total` on the synthetic curve. */
export function xpForSyntheticRank(rank: number, total: number): number {
  const percentile = Math.min(0.99, Math.max(0.01, rank / Math.max(1, total)));
  const score = Math.min(0.99, Math.max(0.01, 1 - percentile));
  const k = 1 / Math.max(1, MEDIAN_XP);
  const xp = MEDIAN_XP + Math.log(score / (1 - score)) / k;
  return Math.max(0, Math.round(xp));
}

function toEntry(
  rank: number,
  total: number,
  xp: number,
  userName: string,
  isCurrentUser: boolean,
  badgeId: string,
  countryFlag: string,
): LeaderboardEntry {
  return {
    rank,
    name: isCurrentUser ? userName : nameForRank(rank),
    xp,
    isCurrentUser,
    badgeId,
    countryFlag,
    isOnline: resolveMockOnlineStatus(
      isCurrentUser ? "me" : `leaderboard-rank-${rank}`,
      isCurrentUser,
    ),
  };
}

function buildCommunityRows(
  total: number,
  userXp: number,
  userName: string,
  userPosition: number,
): LeaderboardRow[] {
  const limit = Math.min(COMMUNITY_TOP_COUNT, total);
  const rows: LeaderboardRow[] = [];

  for (let rank = 1; rank <= limit; rank++) {
    if (rank === userPosition) continue;
    const xp = xpForSyntheticRank(rank, total);
    rows.push({
      kind: "entry",
      entry: toEntry(
        rank,
        total,
        xp,
        userName,
        false,
        resolveBadgeIdForXp(xp),
        countryFlagForRank(rank),
      ),
    });
  }

  return rows;
}

export function buildLeaderboard({
  xp,
  userName,
  position,
  total,
  currentUserBadgeId,
  userCountryFlag,
}: {
  xp: number;
  userName: string;
  position: number;
  total: number;
  currentUserBadgeId: string;
  userCountryFlag: string;
}): LeaderboardSnapshot {
  const safePosition = Math.min(Math.max(1, position), total);
  const currentUser = toEntry(
    safePosition,
    total,
    xp,
    userName,
    true,
    currentUserBadgeId,
    userCountryFlag,
  );
  const others = buildCommunityRows(total, xp, userName, safePosition);

  return {
    currentUser,
    others,
    totalUsers: total,
  };
}

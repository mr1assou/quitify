import { countryFlagForRank, resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import type { BackendLeaderboardEntry, BackendLeaderboardResponse } from "@/types/leaderboardApi";
import type { LeaderboardEntry, LeaderboardRow, LeaderboardSnapshot } from "@/types/leaderboard";

function mapEntry(row: BackendLeaderboardEntry): LeaderboardEntry {
  const countryFlag =
    resolveCountryFlagUrl(row.country_flag ?? undefined) ??
    countryFlagForRank(row.rank);

  return {
    userId: row.user_id,
    rank: row.rank,
    name: row.username,
    xp: row.freedom_points,
    isCurrentUser: row.is_current_user,
    badgeId: row.badge_id,
    countryFlag,
    countryCode: row.country ?? undefined,
    imageUrl: row.image_url ?? undefined,
    isOnline: row.is_online,
  };
}

export function mapLeaderboardFromApi(response: BackendLeaderboardResponse): LeaderboardSnapshot {
  const currentUser = mapEntry(response.viewer);
  const others: LeaderboardRow[] = response.items
    .filter((row) => !row.is_current_user)
    .map((row) => ({ kind: "entry" as const, entry: mapEntry(row) }));

  return {
    currentUser,
    others,
    totalUsers: response.total_users,
    hasMore: response.has_more,
    nextOffset: response.offset + response.items.length,
  };
}

export function mergeLeaderboardPages(
  previous: LeaderboardSnapshot,
  nextPage: LeaderboardSnapshot,
): LeaderboardSnapshot {
  const byUserId = new Map<number, LeaderboardEntry>();

  for (const row of previous.others) {
    if (row.kind !== "entry" || row.entry.userId == null) continue;
    byUserId.set(row.entry.userId, row.entry);
  }

  for (const row of nextPage.others) {
    if (row.kind !== "entry" || row.entry.userId == null) continue;
    byUserId.set(row.entry.userId, row.entry);
  }

  const others = [...byUserId.values()]
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => ({ kind: "entry" as const, entry }));

  return {
    currentUser: nextPage.currentUser,
    others,
    totalUsers: nextPage.totalUsers,
    hasMore: nextPage.hasMore,
    nextOffset: nextPage.nextOffset,
  };
}

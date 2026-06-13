import { countryFlagForRank, resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import type { BackendLeaderboardResponse } from "@/types/leaderboardApi";
import type { LeaderboardEntry, LeaderboardRow, LeaderboardSnapshot } from "@/types/leaderboard";

function mapEntry(row: BackendLeaderboardResponse["items"][number]): LeaderboardEntry {
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
  const entries = response.items.map(mapEntry);
  const currentUser =
    entries.find((entry) => entry.isCurrentUser) ??
    entries[0] ?? {
      userId: 0,
      rank: 1,
      name: "You",
      xp: 0,
      isCurrentUser: true,
      badgeId: "first-step",
      countryFlag: countryFlagForRank(1),
      isOnline: true,
    };

  const others: LeaderboardRow[] = entries
    .filter((entry) => !entry.isCurrentUser)
    .map((entry) => ({ kind: "entry" as const, entry }));

  return {
    currentUser,
    others,
    totalUsers: response.total_users,
  };
}

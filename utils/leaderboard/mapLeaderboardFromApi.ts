import { countryFlagForRank, resolveCountryFlagUrl } from "@/constants/leaderboard/leaderboardCountries";
import type { BackendLeaderboardEntry, BackendLeaderboardResponse } from "@/types/leaderboard/leaderboardApi";
import type { LeaderboardEntry, LeaderboardRow, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";

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

function isSameLeaderboardUser(
  entry: LeaderboardEntry,
  viewer: LeaderboardEntry | null | undefined,
): boolean {
  if (!viewer) return entry.isCurrentUser;
  if (viewer.userId != null && entry.userId != null) {
    return entry.userId === viewer.userId;
  }
  return entry.isCurrentUser;
}

/** Drop the viewer from page rows — by flag and by user id. */
function excludeViewer(
  entries: LeaderboardEntry[],
  viewer: LeaderboardEntry | null,
): LeaderboardEntry[] {
  return entries.filter((entry) => !isSameLeaderboardUser(entry, viewer));
}

export function mapLeaderboardFromApi(response: BackendLeaderboardResponse): LeaderboardSnapshot {
  const currentUser = response.viewer ? mapEntry(response.viewer) : null;
  const viewerUserId = currentUser?.userId ?? response.viewer?.user_id ?? null;

  const others: LeaderboardRow[] = response.items
    .filter((row) => {
      if (row.is_current_user) return false;
      if (viewerUserId != null && row.user_id === viewerUserId) return false;
      return true;
    })
    .map((row) => ({ kind: "entry" as const, entry: mapEntry(row) }));

  return {
    currentUser,
    others,
    totalUsers: response.total_users,
    hasMore: response.has_more,
    startOffset: response.offset,
    nextOffset: response.offset + response.items.length,
  };
}

export function mergeLeaderboardPages(
  previous: LeaderboardSnapshot,
  nextPage: LeaderboardSnapshot,
): LeaderboardSnapshot {
  const currentUser = nextPage.currentUser ?? previous.currentUser;
  const byUserId = new Map<number, LeaderboardEntry>();

  for (const row of [...previous.others, ...nextPage.others]) {
    if (row.kind !== "entry" || row.entry.userId == null) continue;
    if (isSameLeaderboardUser(row.entry, currentUser)) continue;
    byUserId.set(row.entry.userId, row.entry);
  }

  const others = excludeViewer([...byUserId.values()], currentUser)
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => ({ kind: "entry" as const, entry }));

  const extendedDown = nextPage.nextOffset >= previous.nextOffset;

  return {
    currentUser,
    others,
    totalUsers: Math.max(previous.totalUsers, nextPage.totalUsers),
    // Downward page owns hasMore; upward prepend keeps the previous below-flag.
    hasMore: extendedDown ? nextPage.hasMore : previous.hasMore,
    startOffset: Math.min(previous.startOffset, nextPage.startOffset),
    nextOffset: Math.max(previous.nextOffset, nextPage.nextOffset),
  };
}

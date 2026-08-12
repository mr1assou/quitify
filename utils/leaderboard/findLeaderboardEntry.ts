import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";

function isViewerEntry(
  entry: LeaderboardEntry,
  viewer: LeaderboardEntry | null | undefined,
): boolean {
  if (!viewer) return entry.isCurrentUser;
  if (viewer.userId != null && entry.userId != null) {
    return entry.userId === viewer.userId;
  }
  return entry.isCurrentUser;
}

/** Page people only — never includes the viewer (viewer lives on `currentUser`). */
export function listOtherLeaderboardEntries(
  snapshot: LeaderboardSnapshot,
): LeaderboardEntry[] {
  const viewer = snapshot.currentUser;
  const byUserId = new Map<number, LeaderboardEntry>();

  for (const row of snapshot.others) {
    if (row.kind !== "entry") continue;
    const entry = row.entry;
    if (isViewerEntry(entry, viewer)) continue;
    if (entry.userId == null) continue;
    byUserId.set(entry.userId, entry);
  }

  return [...byUserId.values()].sort((a, b) => a.rank - b.rank);
}

/**
 * Flattened board for lookups: others + current user once.
 * Prefer `currentUser` when both exist so the YOU row is authoritative.
 */
export function listLeaderboardEntries(snapshot: LeaderboardSnapshot): LeaderboardEntry[] {
  const others = listOtherLeaderboardEntries(snapshot);
  const current = snapshot.currentUser;
  if (!current) return others;

  const withoutSelf = others.filter((entry) => !isViewerEntry(entry, current));
  return [...withoutSelf, current].sort((a, b) => a.rank - b.rank);
}

export function findLeaderboardEntryByRank(
  snapshot: LeaderboardSnapshot,
  rank: number,
): LeaderboardEntry | null {
  return listLeaderboardEntries(snapshot).find((entry) => entry.rank === rank) ?? null;
}

export function findLeaderboardEntryByUserId(
  snapshot: LeaderboardSnapshot,
  userId: number,
): LeaderboardEntry | null {
  return listLeaderboardEntries(snapshot).find((entry) => entry.userId === userId) ?? null;
}

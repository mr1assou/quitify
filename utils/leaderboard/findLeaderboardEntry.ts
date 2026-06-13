import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard";

export function listLeaderboardEntries(snapshot: LeaderboardSnapshot): LeaderboardEntry[] {
  const byKey = new Map<string, LeaderboardEntry>();

  for (const row of snapshot.others) {
    if (row.kind !== "entry") continue;
    const key = row.entry.userId != null ? `u-${row.entry.userId}` : `r-${row.entry.rank}`;
    byKey.set(key, row.entry);
  }

  const current = snapshot.currentUser;
  const currentKey = current.userId != null ? `u-${current.userId}` : `r-${current.rank}`;
  byKey.set(currentKey, current);

  return [...byKey.values()].sort((a, b) => a.rank - b.rank);
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

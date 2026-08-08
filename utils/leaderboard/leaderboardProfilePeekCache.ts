import type { LeaderboardEntry } from "@/types/leaderboard/leaderboard";

/**
 * Last-tapped leaderboard entries kept across navigation so profile screens
 * still resolve after a silent leaderboard page refresh wipes deeper ranks.
 */
const byUserId = new Map<number, LeaderboardEntry>();
const byRank = new Map<number, LeaderboardEntry>();

export function rememberLeaderboardEntry(entry: LeaderboardEntry): void {
  byRank.set(entry.rank, entry);
  if (entry.userId != null) {
    byUserId.set(entry.userId, entry);
  }
}

export function peekLeaderboardEntryByUserId(userId: number): LeaderboardEntry | null {
  return byUserId.get(userId) ?? null;
}

export function peekLeaderboardEntryByRank(rank: number): LeaderboardEntry | null {
  return byRank.get(rank) ?? null;
}

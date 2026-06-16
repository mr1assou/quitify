import type { LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";

let leaderboardCache: LeaderboardSnapshot | null = null;

export function getLeaderboardCache(): LeaderboardSnapshot | null {
  return leaderboardCache;
}

export function setLeaderboardCache(snapshot: LeaderboardSnapshot | null): void {
  leaderboardCache = snapshot;
}

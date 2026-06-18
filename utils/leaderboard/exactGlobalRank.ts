import type { LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";
import type { GlobalRank } from "@/types/progress/progress";

/** Replace the synthetic rank with the user's exact Freedom Points leaderboard position. */
export function exactGlobalRankFromLeaderboard(
  snapshot: LeaderboardSnapshot,
  fallback: GlobalRank,
): GlobalRank {
  return {
    ...fallback,
    xp: snapshot.currentUser.xp,
    position: snapshot.currentUser.rank,
    total: snapshot.totalUsers,
  };
}

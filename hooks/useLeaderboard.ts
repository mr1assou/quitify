import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useProgress } from "@/hooks/useProgress";
import type { LeaderboardSnapshot } from "@/types/leaderboard";
import { resolveHighestUnlockedBadgeId } from "@/utils/badges";
import { buildLeaderboard } from "@/utils/leaderboard";

/**
 * Synthetic global leaderboard with the signed-in user inserted at their rank.
 */
export function useLeaderboard(): LeaderboardSnapshot | null {
  const { state } = useApp();
  const progress = useProgress();

  return useMemo(() => {
    if (!progress) return null;

    const userName = state.profile?.name?.trim() || "You";

    const currentUserBadgeId =
      resolveHighestUnlockedBadgeId(progress.badges, state.isPremium) ?? "first-step";

    return buildLeaderboard({
      xp: progress.xp,
      userName,
      position: progress.rank.position,
      total: progress.rank.total,
      currentUserBadgeId,
    });
  }, [progress, state.profile?.name, state.isPremium]);
}

import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useProgress } from "@/hooks/useProgress";
import type { LeaderboardSnapshot } from "@/types/leaderboard";
import { resolveHighestUnlockedBadgeId } from "@/utils/badges";
import { countryFlagForRank, resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import { buildLeaderboard } from "@/utils/leaderboard";

/**
 * Synthetic global leaderboard with the signed-in user inserted at their rank.
 */
export function useLeaderboard(): LeaderboardSnapshot | null {
  const { state } = useApp();
  const progress = useProgress();

  return useMemo(() => {
    if (!progress) return null;

    const profile = state.profile;
    const userName = profile?.name?.trim() || "You";
    const userCountryFlag =
      resolveCountryFlagUrl(profile?.countryFlag, profile?.countryCode) ??
      countryFlagForRank(progress.rank.position);

    const currentUserBadgeId =
      resolveHighestUnlockedBadgeId(progress.badges, state.isPremium) ?? "first-step";

    return buildLeaderboard({
      xp: progress.xp,
      userName,
      position: progress.rank.position,
      total: progress.rank.total,
      currentUserBadgeId,
      userCountryFlag,
    });
  }, [
    progress,
    state.profile?.countryCode,
    state.profile?.countryFlag,
    state.profile?.name,
    state.isPremium,
  ]);
}

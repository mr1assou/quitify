import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { dbAuthorId } from "@/utils/community/presence";
import { buildProfileFromLeaderboardEntry } from "@/utils/leaderboard/buildProfileFromLeaderboardEntry";
import { findLeaderboardEntryByRank } from "@/utils/leaderboard/findLeaderboardEntry";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";

export function useLeaderboardPlayer(rank: number): PlayerProfile | null {
  const { snapshot: leaderboard } = useLeaderboard();
  const { state } = useApp();
  const { state: communityState } = useCommunity();

  return useMemo(() => {
    if (!Number.isFinite(rank) || rank < 1) return null;

    const snapshot = leaderboard ?? getLeaderboardCache();
    if (!snapshot) return null;

    const entry = findLeaderboardEntryByRank(snapshot, rank);
    if (!entry) return null;

    const communityAuthor = entry.userId
      ? communityState.authorsById[dbAuthorId(entry.userId)]
      : undefined;

    return buildProfileFromLeaderboardEntry(entry, snapshot, {
      appProfile: state.profile,
      communityAuthor,
    });
  }, [communityState.authorsById, leaderboard, rank, state.profile]);
}

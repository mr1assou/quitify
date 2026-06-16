import { useMemo } from "react";

import { getCommunityUser } from "@/constants/community/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { parseDbUserId } from "@/utils/community/presence";
import { buildProfileFromLeaderboardEntry } from "@/utils/leaderboard/buildProfileFromLeaderboardEntry";
import { findLeaderboardEntryByUserId } from "@/utils/leaderboard/findLeaderboardEntry";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { buildPlayerProfileFromCommunityUser } from "@/utils/profile/buildPlayerProfileFromCommunityUser";

const DEFAULT_TOTAL_PLAYERS = 100_000;

export function useCommunityPlayerProfile(communityUserId: string): PlayerProfile | null {
  const { state } = useCommunity();
  const { snapshot: leaderboard } = useLeaderboard();

  return useMemo(() => {
    const snapshot = leaderboard ?? getLeaderboardCache();
    const userId = parseDbUserId(communityUserId);

    if (userId && snapshot) {
      const entry = findLeaderboardEntryByUserId(snapshot, userId);
      if (entry && !entry.isCurrentUser) {
        return buildProfileFromLeaderboardEntry(entry, snapshot, {
          communityAuthor: state.authorsById[communityUserId],
        });
      }
    }

    const user = state.authorsById[communityUserId] ?? getCommunityUser(communityUserId);
    if (!user || user.isCurrentUser) return null;

    const totalPlayers = snapshot?.totalUsers ?? DEFAULT_TOTAL_PLAYERS;
    return buildPlayerProfileFromCommunityUser(user, totalPlayers);
  }, [communityUserId, leaderboard, state.authorsById]);
}

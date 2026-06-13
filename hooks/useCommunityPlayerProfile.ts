import { useMemo } from "react";

import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { PlayerProfile } from "@/types/playerProfile";
import { buildPlayerProfileFromCommunityUser } from "@/utils/profile/buildPlayerProfileFromCommunityUser";

const DEFAULT_TOTAL_PLAYERS = 100_000;

export function useCommunityPlayerProfile(communityUserId: string): PlayerProfile | null {
  const { state } = useCommunity();
  const leaderboard = useLeaderboard();

  return useMemo(() => {
    const user = state.authorsById[communityUserId] ?? getCommunityUser(communityUserId);
    if (!user || user.isCurrentUser) return null;

    const totalPlayers = leaderboard?.totalUsers ?? DEFAULT_TOTAL_PLAYERS;
    return buildPlayerProfileFromCommunityUser(user, totalPlayers);
  }, [communityUserId, leaderboard?.totalUsers, state.authorsById]);
}

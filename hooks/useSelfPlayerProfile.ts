import { useMemo } from "react";

import { resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import {
  LEADERBOARD_STATIC_BADGE_ID,
} from "@/constants/leaderboardPlaceholders";
import { useApp } from "@/context/AppContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { PlayerProfile } from "@/types/playerProfile";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { buildPlayerProfile } from "@/utils/leaderboard/playerProfilePresentation";

export function useSelfPlayerProfile(): PlayerProfile | null {
  const { state } = useApp();
  const { snapshot: leaderboard } = useLeaderboard();

  return useMemo(() => {
    const profile = state.profile;
    if (!profile) return null;

    const snapshot = leaderboard ?? getLeaderboardCache();
    const name = state.account?.name?.trim() || profile.name?.trim() || "You";
    const countryFlag =
      resolveCountryFlagUrl(profile.countryFlag, profile.countryCode) ??
      snapshot?.currentUser.countryFlag;

    if (snapshot) {
      return buildPlayerProfile(snapshot.currentUser, snapshot.totalUsers, {
        name,
        countryFlag,
        countryCode: profile.countryCode,
        avatarUrl: profile.imageUrl,
      });
    }

    return buildPlayerProfile(
      {
        userId: state.account?.userId,
        rank: 1,
        name,
        xp: state.account?.freedomPoints ?? 0,
        isCurrentUser: true,
        badgeId: LEADERBOARD_STATIC_BADGE_ID,
        countryFlag: countryFlag ?? "",
        imageUrl: profile.imageUrl,
        isOnline: true,
      },
      1,
      {
        name,
        countryFlag,
        countryCode: profile.countryCode,
        avatarUrl: profile.imageUrl,
      },
    );
  }, [leaderboard, state.account?.name, state.account?.userId, state.account?.freedomPoints, state.profile]);
}

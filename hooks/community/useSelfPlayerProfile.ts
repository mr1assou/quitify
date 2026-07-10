import { useMemo } from "react";

import { FIRST_STEP_BADGE_ID } from "@/constants/progress/badges";
import { resolveCountryFlagUrl } from "@/constants/leaderboard/leaderboardCountries";
import { useApp } from "@/context/AppContext";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import { useProgress } from "@/hooks/progress/useProgress";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { buildPlayerProfile } from "@/utils/leaderboard/playerProfilePresentation";
import { resolveHighestUnlockedBadgeId } from "@/utils/progress/badges";

export function useSelfPlayerProfile(): PlayerProfile | null {
  const { state } = useApp();
  const { snapshot: leaderboard } = useLeaderboard();
  const isPremium = useIsPremium();
  const progress = useProgress();

  return useMemo(() => {
    const profile = state.profile;
    if (!profile) return null;

    const snapshot = leaderboard ?? getLeaderboardCache();
    const name = state.account?.name?.trim() || profile.name?.trim() || "You";
    const countryFlag =
      resolveCountryFlagUrl(profile.countryFlag, profile.countryCode) ??
      snapshot?.currentUser?.countryFlag;
    const fallbackBadgeId =
      (progress && resolveHighestUnlockedBadgeId(progress.badges, isPremium)) ??
      FIRST_STEP_BADGE_ID;

    if (snapshot?.currentUser) {
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
        xp: (state.account?.freedomPoints ?? 0) + state.localFreedomPoints,
        isCurrentUser: true,
        badgeId: fallbackBadgeId,
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
  }, [
    isPremium,
    leaderboard,
    progress,
    state.account?.name,
    state.account?.userId,
    state.account?.freedomPoints,
    state.localFreedomPoints,
    state.profile,
  ]);
}

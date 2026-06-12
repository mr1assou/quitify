import { useMemo } from "react";

import { resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import { useApp } from "@/context/AppContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { PlayerProfile } from "@/types/playerProfile";
import { buildPlayerProfile } from "@/utils/leaderboard/playerProfilePresentation";

export function useSelfPlayerProfile(): PlayerProfile | null {
  const { state } = useApp();
  const leaderboard = useLeaderboard();

  return useMemo(() => {
    if (!leaderboard) return null;

    const entry = leaderboard.currentUser;
    const profile = state.profile;
    const name = state.account?.name?.trim() || profile?.name?.trim() || entry.name;

    return buildPlayerProfile(entry, leaderboard.totalUsers, {
      name,
      countryFlag:
        resolveCountryFlagUrl(profile?.countryFlag, profile?.countryCode) ?? entry.countryFlag,
      countryCode: profile?.countryCode,
    });
  }, [leaderboard, state.account?.name, state.profile]);
}

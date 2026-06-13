import { useMemo } from "react";

import { resolveCountryFlagUrl } from "@/constants/leaderboardCountries";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { PlayerProfile } from "@/types/playerProfile";
import { buildPlayerProfile } from "@/utils/leaderboard/playerProfilePresentation";

function findEntryByRank(rank: number, leaderboard: NonNullable<ReturnType<typeof useLeaderboard>>) {
  if (leaderboard.currentUser.rank === rank) return leaderboard.currentUser;

  for (const row of leaderboard.others) {
    if (row.kind === "entry" && row.entry.rank === rank) {
      return row.entry;
    }
  }

  return null;
}

export function useLeaderboardPlayer(rank: number): PlayerProfile | null {
  const leaderboard = useLeaderboard();
  const { state } = useApp();
  const { state: communityState } = useCommunity();

  return useMemo(() => {
    if (!leaderboard || !Number.isFinite(rank) || rank < 1) return null;

    const entry = findEntryByRank(rank, leaderboard);
    if (!entry) return null;

    const profile = state.profile;
    const dbAuthor = Object.values(communityState.authorsById).find(
      (author) => !author.isCurrentUser && author.name === entry.name && author.avatarUrl,
    );

    const overrides =
      entry.isCurrentUser && profile
        ? {
            name: profile.name?.trim() || entry.name,
            countryFlag:
              resolveCountryFlagUrl(profile.countryFlag, profile.countryCode) ??
              entry.countryFlag,
            countryCode: profile.countryCode,
            avatarUrl: profile.imageUrl,
          }
        : dbAuthor?.avatarUrl
          ? { avatarUrl: dbAuthor.avatarUrl }
          : undefined;

    return buildPlayerProfile(entry, leaderboard.totalUsers, overrides);
  }, [communityState.authorsById, leaderboard, rank, state.profile]);
}

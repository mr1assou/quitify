import { resolveCountryFlagUrl } from "@/constants/leaderboard/leaderboardCountries";
import type { CommunityUser } from "@/types/community/community";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";
import type { PlayerProfile } from "@/types/profile/playerProfile";
import type { UserProfile } from "@/types/profile/profile";
import { buildPlayerProfile } from "@/utils/leaderboard/playerProfilePresentation";

type BuildOptions = {
  appProfile?: UserProfile | null;
  communityAuthor?: CommunityUser;
};

export function buildProfileFromLeaderboardEntry(
  entry: LeaderboardEntry,
  snapshot: LeaderboardSnapshot,
  options: BuildOptions = {},
): PlayerProfile {
  const { appProfile, communityAuthor } = options;

  if (entry.isCurrentUser && appProfile) {
    return buildPlayerProfile(entry, snapshot.totalUsers, {
      name: appProfile.name?.trim() || entry.name,
      countryFlag:
        resolveCountryFlagUrl(appProfile.countryFlag, appProfile.countryCode) ?? entry.countryFlag,
      countryCode: appProfile.countryCode,
      avatarUrl: appProfile.imageUrl ?? entry.imageUrl,
    });
  }

  return buildPlayerProfile(entry, snapshot.totalUsers, {
    avatarUrl: entry.imageUrl ?? communityAuthor?.avatarUrl,
    countryCode: entry.countryCode ?? communityAuthor?.countryCode,
  });
}
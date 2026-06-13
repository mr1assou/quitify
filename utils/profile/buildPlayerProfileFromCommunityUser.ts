import { countryLabelForLocation } from "@/constants/communityUsers";
import { XP_PER_SMOKE_FREE_DAY } from "@/constants/levels";
import type { CommunityUser } from "@/types/community";
import type { PlayerProfile } from "@/types/playerProfile";
import { withMockOnlineStatus } from "@/utils/community/mockOnlineStatus";
import {
  bestSmokeFreeDaysForRank,
  memberSinceLabelForRank,
} from "@/utils/leaderboard/playerProfilePresentation";

import { toCommunityProfileId } from "./communityProfileLinks";

export function buildPlayerProfileFromCommunityUser(
  user: CommunityUser,
  totalPlayers: number,
): PlayerProfile {
  const resolved = withMockOnlineStatus(user);
  const freedomPoints = resolved.smokeFreeDays * XP_PER_SMOKE_FREE_DAY;

  return {
    id: toCommunityProfileId(resolved.id),
    name: resolved.name,
    rank: resolved.leaderboardRank,
    totalPlayers,
    freedomPoints,
    badgeId: resolved.badgeId,
    countryFlag: resolved.countryFlag,
    countryLabel: countryLabelForLocation(resolved.location),
    isOnline: resolved.isOnline,
    smokeFreeDays: resolved.smokeFreeDays,
    bestSmokeFreeDays: bestSmokeFreeDaysForRank(resolved.smokeFreeDays, resolved.leaderboardRank),
    isCurrentUser: false,
    bio: resolved.bio,
    memberSinceLabel: memberSinceLabelForRank(resolved.leaderboardRank),
    avatarUrl: resolved.avatarUrl,
  };
}

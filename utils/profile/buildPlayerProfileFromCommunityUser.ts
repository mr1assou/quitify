import { countryLabelForLocation } from "@/constants/communityUsers";
import { XP_PER_SMOKE_FREE_DAY } from "@/constants/levels";
import type { CommunityUser } from "@/types/community";
import type { PlayerProfile } from "@/types/playerProfile";
import {
  bestSmokeFreeDaysForRank,
  memberSinceLabelForRank,
} from "@/utils/leaderboard/playerProfilePresentation";

import { toCommunityProfileId } from "./communityProfileLinks";

export function buildPlayerProfileFromCommunityUser(
  user: CommunityUser,
  totalPlayers: number,
): PlayerProfile {
  const freedomPoints = user.smokeFreeDays * XP_PER_SMOKE_FREE_DAY;

  return {
    id: toCommunityProfileId(user.id),
    name: user.name,
    rank: user.leaderboardRank,
    totalPlayers,
    freedomPoints,
    badgeId: user.badgeId,
    countryFlag: user.countryFlag,
    countryLabel: countryLabelForLocation(user.location),
    smokeFreeDays: user.smokeFreeDays,
    bestSmokeFreeDays: bestSmokeFreeDaysForRank(user.smokeFreeDays, user.leaderboardRank),
    isCurrentUser: false,
    bio: user.bio,
    memberSinceLabel: memberSinceLabelForRank(user.leaderboardRank),
    avatarUrl: user.avatarUrl,
  };
}

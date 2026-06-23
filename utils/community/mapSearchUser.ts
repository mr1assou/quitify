import { DEFAULT_USER_ROLE } from "@/constants/auth/userRoles";
import { countryFlagForRank, resolveCountryFlagUrl } from "@/constants/leaderboard/leaderboardCountries";
import type { BackendUserSearchResult } from "@/types/users/userSearch";
import type { CommunityUser } from "@/types/community/community";
import { dbAuthorId } from "@/utils/community/presence";

export function mapSearchUserToCommunityUser(
  user: BackendUserSearchResult,
): CommunityUser {
  const handle = user.username.trim() || "user";
  const countryFlag =
    resolveCountryFlagUrl(user.country_flag ?? undefined, user.country ?? undefined) ??
    countryFlagForRank(1);

  return {
    id: dbAuthorId(user.user_id),
    name: handle,
    handle,
    bio: "",
    smokeFreeDays: 0,
    badgeId: user.badge_id,
    countryFlag,
    countryCode: user.country ?? undefined,
    avatarRank: 1,
    leaderboardRank: 0,
    avatarUrl: user.image_url ?? undefined,
    isOnline: user.is_online,
    role: DEFAULT_USER_ROLE,
  };
}

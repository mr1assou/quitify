import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import { FIRST_STEP_BADGE_ID } from "@/constants/progress/badges";
import type { IncomingCallPayload } from "@/types/call/signaling";
import type { CommunityUser } from "@/types/community/community";
import { dbAuthorId } from "@/utils/community/presence";

/** Builds a display author for the caller so the call screen can render them. */
export function mapIncomingCallToCommunityUser(
  incoming: IncomingCallPayload,
): CommunityUser {
  const handle = incoming.callerName?.trim() || "user";
  const countryFlag =
    resolveCountryFlagUrl(incoming.callerCountryFlag ?? undefined) ??
    countryFlagForRank(1);

  return {
    id: dbAuthorId(incoming.fromUserId),
    name: handle,
    handle,
    bio: "",
    smokeFreeDays: 0,
    badgeId: incoming.callerBadgeId ?? FIRST_STEP_BADGE_ID,
    countryFlag,
    avatarRank: 1,
    leaderboardRank: 0,
    avatarUrl: incoming.callerAvatarUrl ?? undefined,
  };
}

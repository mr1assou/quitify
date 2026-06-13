import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { CommunityUser } from "@/types/community";
import { safeRouter } from "@/utils/safeRouter";

type ProfileTarget = Pick<CommunityUser, "id" | "isCurrentUser">;

type NavigateToUserProfileOptions = {
  /** Leaderboard rank for the signed-in user (required to open their player profile). */
  currentUserRank?: number;
};

export function navigateToSelfPlayerProfile(rank: number) {
  if (!Number.isFinite(rank) || rank < 1) return;
  safeRouter.push(`/player/${rank}`);
}

export function navigateToUserProfile(
  user: ProfileTarget,
  options?: NavigateToUserProfileOptions,
) {
  if (user.isCurrentUser || user.id === CURRENT_USER_ID) {
    const rank = options?.currentUserRank;
    if (rank != null && rank >= 1) {
      navigateToSelfPlayerProfile(rank);
    }
    return;
  }

  safeRouter.push(`/player/community/${user.id}`);
}

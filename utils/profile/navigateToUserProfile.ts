import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { CommunityUser } from "@/types/community";
import { safeRouter } from "@/utils/safeRouter";

type ProfileTarget = Pick<CommunityUser, "id" | "isCurrentUser">;

export function navigateToSelfPlayerProfile(rank: number) {
  if (!Number.isFinite(rank) || rank < 1) return;
  safeRouter.push(`/player/${rank}`);
}

export function navigateToUserProfile(user: ProfileTarget) {
  if (user.isCurrentUser || user.id === CURRENT_USER_ID) {
    safeRouter.push("/profile");
    return;
  }

  safeRouter.push(`/player/community/${user.id}`);
}

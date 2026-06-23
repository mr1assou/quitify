import type { UserAccount, UserProfile } from "@/types";
import { buildProfileFromMe } from "@/utils/auth/buildProfileFromMe";

import { fetchAuthMe } from "./meApi";

export type UserSessionFromApi = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  account: UserAccount | null;
};

/** Loads onboarded state + profile from `GET /auth/me` (no local profile cache). */
export async function loadUserSessionFromApi(
  accessToken: string,
): Promise<UserSessionFromApi> {
  const me = await fetchAuthMe(accessToken);
  const account: UserAccount = {
    userId: me.userId,
    email: me.email,
    name: me.name,
    createdAt: Date.now(),
    earnedBadgeIds: me.earnedBadgeIds ?? [],
    freedomPoints: me.freedomPoints ?? 0,
    goalsCompleted: me.goalsCompleted ?? 0,
    motivationCardIndex: me.motivationCardIndex ?? 0,
    tipsCardIndex: me.tipsCardIndex ?? 0,
  };

  if (!me.hasCompletedOnboarding) {
    return { isOnboarded: false, profile: null, account };
  }

  return {
    isOnboarded: true,
    profile: buildProfileFromMe(me),
    account,
  };
}

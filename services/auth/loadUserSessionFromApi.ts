import type { UserAccount, UserProfile } from "@/types";
import { DEFAULT_USER_ROLE } from "@/constants/auth/userRoles";
import { buildProfileFromMe } from "@/utils/auth/buildProfileFromMe";

import { fetchAuthMe } from "./meApi";
import type { AuthMeResponse } from "./meApi";

export type UserSessionFromApi = {
  isOnboarded: boolean;
  profile: UserProfile | null;
  account: UserAccount | null;
};

/** Maps `/auth/me` (or reset-journey) payload into app session state. */
export function mapAuthMeToSession(
  me: AuthMeResponse,
  previousAccount?: UserAccount | null,
): UserSessionFromApi {
  const account: UserAccount = {
    userId: me.userId,
    email: me.email,
    name: me.name,
    createdAt: previousAccount?.createdAt ?? Date.now(),
    role: me.role ?? DEFAULT_USER_ROLE,
    earnedBadgeIds: me.earnedBadgeIds ?? [],
    freedomPoints: me.freedomPoints ?? 0,
    goalsCompleted: me.goalsCompleted ?? 0,
    motivationCardIndex: me.motivationCardIndex ?? 0,
    tipsCardIndex: me.tipsCardIndex ?? 0,
    savedTipCardIds: me.savedTipCardIds ?? [],
    savedMotivationCardIds: me.savedMotivationCardIds ?? [],
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

/** Loads onboarded state + profile from `GET /auth/me` (no local profile cache). */
export async function loadUserSessionFromApi(
  accessToken: string,
): Promise<UserSessionFromApi> {
  const me = await fetchAuthMe(accessToken);
  return mapAuthMeToSession(me);
}

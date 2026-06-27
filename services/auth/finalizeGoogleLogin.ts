import type { UserAccount, UserProfile } from "@/types";
import { saveAuthTokens } from "@/utils/auth/authStorage";

import { loadUserSessionFromApi } from "./loadUserSessionFromApi";
import type { UserSessionFromApi } from "./loadUserSessionFromApi";
import type { GoogleAuthResponse } from "./types";

type CompleteHandlers = {
  setAccount: (account: UserAccount) => void;
  completeOnboarding: (profile: UserProfile) => void;
};

/** Existing-user Google login — no signup or onboarding sync. */
export async function finalizeGoogleLogin(
  auth: GoogleAuthResponse,
  handlers: CompleteHandlers,
): Promise<UserSessionFromApi> {
  await saveAuthTokens(auth.accessToken, auth.refreshToken);

  const session = await loadUserSessionFromApi(auth.accessToken);
  if (session.account) {
    handlers.setAccount(session.account);
  }
  if (session.isOnboarded && session.profile) {
    handlers.completeOnboarding(session.profile);
  }

  return session;
}

import type { UserAccount, UserProfile } from "@/types";
import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import { saveAuthTokens } from "@/utils/auth/authStorage";
import { markPushPermissionPromptPending } from "@/utils/push/signupPushPromptStorage";

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

  if (session.isOnboarded) {
    let hadPushToken = false;
    try {
      hadPushToken = await fetchPushTokenStatus();
    } catch {
      // Prompt fallback still runs in usePushNotificationsOnAuth when applicable.
    }

    if (hadPushToken) {
      await markPushPermissionPromptPending();
    }
  }

  if (session.account) {
    handlers.setAccount(session.account);
  }
  if (session.isOnboarded && session.profile) {
    handlers.completeOnboarding(session.profile);
  }

  return session;
}


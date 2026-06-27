import type { OnboardingDraft, UserAccount, UserProfile } from "@/types";
import { saveAuthTokens } from "@/utils/auth/authStorage";
import { buildOnboardingPayload } from "@/utils/onboarding/buildOnboardingPayload";
import { isOnboardingDraftComplete } from "@/utils/onboarding/isOnboardingDraftComplete";

import { loadUserSessionFromApi } from "./loadUserSessionFromApi";
import { syncOnboardingToBackend } from "./syncOnboardingApi";
import type { GoogleAuthResponse } from "./types";

type CompleteHandlers = {
  setAccount: (account: UserAccount) => void;
  completeOnboarding: (profile: UserProfile) => void;
};

let finishPromise: Promise<void> | null = null;

/** Runs Google post-auth once (avoids duplicate work from OAuth deep link + WebBrowser). */
export async function finalizeGoogleAuth(
  auth: GoogleAuthResponse,
  draft: OnboardingDraft,
  handlers: CompleteHandlers,
): Promise<void> {
  if (finishPromise) return finishPromise;

  finishPromise = (async () => {
    await saveAuthTokens(auth.accessToken, auth.refreshToken);

    if (auth.isNewUser) {
      if (!isOnboardingDraftComplete(draft)) {
        throw new Error(
          "Complete the setup steps first before signing up with Google.",
        );
      }
      const syncedAt = Date.now();
      await syncOnboardingToBackend(buildOnboardingPayload(draft, syncedAt));
    }

    const session = await loadUserSessionFromApi(auth.accessToken);
    if (!session.isOnboarded || !session.profile || !session.account) {
      throw new Error("Onboarding was not saved on the server");
    }

    handlers.setAccount(session.account);
    handlers.completeOnboarding(session.profile);
  })().finally(() => {
    finishPromise = null;
  });

  return finishPromise;
}

import type { OnboardingDraft, UserAccount, UserProfile } from "@/types";
import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";
import { saveAuthTokens } from "@/utils/authStorage";
import { buildOnboardingPayload } from "@/utils/onboarding/buildOnboardingPayload";
import { isOnboardingDraftComplete } from "@/utils/onboarding/isOnboardingDraftComplete";

import { loadUserSessionFromApi } from "./loadUserSessionFromApi";
import { syncOnboardingToBackend } from "./syncOnboardingApi";
import { updateUserPreferences } from "./preferencesApi";
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
    await updateUserPreferences({ timezone: getDeviceTimezone() });

    if (auth.isNewUser) {
      if (!isOnboardingDraftComplete(draft)) {
        throw new Error(
          "Complete the setup steps first, or sign in with the Google account you already used.",
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

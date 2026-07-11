import type { OnboardingDraft, UserAccount, UserProfile } from "@/types";
import { saveAuthTokens } from "@/utils/auth/authStorage";
import { buildOnboardingPayload } from "@/utils/onboarding/buildOnboardingPayload";
import { isOnboardingDraftComplete } from "@/utils/onboarding/isOnboardingDraftComplete";
import { markPostSignupFlowPending } from "@/utils/onboarding/postSignupFlowStorage";

import { loadUserSessionFromApi } from "./loadUserSessionFromApi";
import { syncOnboardingToBackend } from "./syncOnboardingApi";
import type { GoogleAuthResponse } from "./types";

type CompleteHandlers = {
  setAccount: (account: UserAccount) => void;
  completeOnboarding: (profile: UserProfile) => void;
};

/** New email sign-up after OTP — syncs onboarding then loads the server session. */
export async function finalizeEmailSignup(
  auth: GoogleAuthResponse,
  draft: OnboardingDraft,
  handlers: CompleteHandlers,
): Promise<void> {
  await saveAuthTokens(auth.accessToken, auth.refreshToken);
  await markPostSignupFlowPending();

  if (!isOnboardingDraftComplete(draft)) {
    throw new Error("Complete the setup steps first before signing up with email.");
  }

  const syncedAt = Date.now();
  await syncOnboardingToBackend(buildOnboardingPayload(draft, syncedAt));

  const session = await loadUserSessionFromApi(auth.accessToken);
  if (!session.isOnboarded || !session.profile || !session.account) {
    throw new Error("Onboarding was not saved on the server");
  }

  handlers.setAccount(session.account);
  handlers.completeOnboarding(session.profile);
}

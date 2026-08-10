import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { resetToWelcome } from "@/utils/app/safeRouter";
import { clearGoogleSignInSession } from "@/utils/auth/clearGoogleSignInSession";

/** Signs out, wipes local app state, and returns the user to the welcome screen. */
export function useLogout() {
  const { logout } = useApp();
  const { resetCommunity } = useCommunity();
  const { reset: resetOnboardingDraft } = useOnboarding();
  const loggingOutRef = useRef(false);

  return useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;

    try {
      await logout();
      await clearGoogleSignInSession();
      resetCommunity();
      resetOnboardingDraft();
      // Dismiss stacked screens so Android back cannot reopen logged-in UI.
      resetToWelcome();
    } catch {
      loggingOutRef.current = false;
    }
  }, [logout, resetCommunity, resetOnboardingDraft]);
}

import { useCallback, useRef } from "react";

import { WELCOME_ROUTE } from "@/constants/app/routes";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { safeRouter } from "@/utils/app/safeRouter";

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
      resetCommunity();
      resetOnboardingDraft();
      safeRouter.replace(WELCOME_ROUTE);
    } catch {
      loggingOutRef.current = false;
    }
  }, [logout, resetCommunity, resetOnboardingDraft]);
}

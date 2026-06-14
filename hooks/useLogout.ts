import { useCallback } from "react";

import { WELCOME_ROUTE } from "@/constants/routes";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { safeRouter } from "@/utils/safeRouter";

/** Signs out, wipes local app state, and returns the user to the welcome screen. */
export function useLogout() {
  const { logout } = useApp();
  const { resetCommunity } = useCommunity();
  const { reset: resetOnboardingDraft } = useOnboarding();

  return useCallback(async () => {
    await logout();
    resetCommunity();
    resetOnboardingDraft();
    safeRouter.replace(WELCOME_ROUTE);
  }, [logout, resetCommunity, resetOnboardingDraft]);
}

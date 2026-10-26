import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

import { useApp } from "@/context/AppContext";
import {
  clearPostSignupFlowFlags,
  isPostPaywallFlowComplete,
  isPushPromptWaitsForPaywall,
} from "@/utils/onboarding/postSignupFlowStorage";
import {
  clearPushPermissionPromptPending,
  isPushPermissionPromptPending,
} from "@/utils/push/signupPushPromptStorage";

/**
 * After a new sign-up, do not ask for notification permission when the paywall closes.
 * Drop the pending prompt so it is not shown later on Home.
 */
export function usePostPaywallNotificationPrompt() {
  const { isHydrated, state } = useApp();
  const userId = state.account?.userId;
  const consumedRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!isHydrated || !userId || consumedRef.current) return;

      let cancelled = false;

      void (async () => {
        const [waitsForPaywall, pushPending, paywallDone] = await Promise.all([
          isPushPromptWaitsForPaywall(),
          isPushPermissionPromptPending(),
          isPostPaywallFlowComplete(),
        ]);

        if (cancelled || consumedRef.current) return;
        if (!waitsForPaywall || !pushPending || !paywallDone) return;

        consumedRef.current = true;
        await clearPushPermissionPromptPending();
        await clearPostSignupFlowFlags();
      })();

      return () => {
        cancelled = true;
      };
    }, [isHydrated, userId]),
  );
}

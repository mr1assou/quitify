import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

import { POST_PAYWALL_PUSH_PROMPT_DELAY_MS } from "@/constants/onboarding/postSignupFlow";
import { useApp } from "@/context/AppContext";
import {
  isPostPaywallFlowComplete,
  isPushPromptWaitsForPaywall,
} from "@/utils/onboarding/postSignupFlowStorage";
import { isPushPermissionPromptPending } from "@/utils/push/signupPushPromptStorage";
import { runDeferredPushPermissionPrompt } from "@/utils/push/runDeferredPushPermissionPrompt";

/**
 * After the post-sign-up paywall closes, ask for notification permission on Home
 * after a short delay or the user's first interaction.
 */
export function usePostPaywallNotificationPrompt() {
  const { isHydrated, state } = useApp();
  const accountEmail = state.account?.email;
  const armedRef = useRef(false);
  const triggeredRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const triggerPrompt = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    armedRef.current = false;
    clearTimer();
    void runDeferredPushPermissionPrompt();
  }, [clearTimer]);

  const armIfReady = useCallback(async () => {
    if (!isHydrated || !accountEmail || triggeredRef.current) return;

    const [waitsForPaywall, paywallDone, pushPending] = await Promise.all([
      isPushPromptWaitsForPaywall(),
      isPostPaywallFlowComplete(),
      isPushPermissionPromptPending(),
    ]);

    if (!waitsForPaywall || !paywallDone || !pushPending) {
      armedRef.current = false;
      clearTimer();
      return;
    }

    if (armedRef.current) return;
    armedRef.current = true;

    clearTimer();
    timeoutRef.current = setTimeout(triggerPrompt, POST_PAYWALL_PUSH_PROMPT_DELAY_MS);
  }, [accountEmail, clearTimer, isHydrated, triggerPrompt]);

  useFocusEffect(
    useCallback(() => {
      void armIfReady();
      return () => clearTimer();
    }, [armIfReady, clearTimer]),
  );

  const onHomeInteraction = useCallback(() => {
    if (!armedRef.current) return;
    triggerPrompt();
  }, [triggerPrompt]);

  return { onHomeInteraction };
}

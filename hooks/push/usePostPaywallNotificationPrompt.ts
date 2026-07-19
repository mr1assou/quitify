import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

import { POST_PAYWALL_PUSH_PROMPT_DELAY_MS } from "@/constants/onboarding/postSignupFlow";
import { useApp } from "@/context/AppContext";
import {
  isPushPromptWaitsForPaywall,
} from "@/utils/onboarding/postSignupFlowStorage";
import { isPushPermissionPromptPending } from "@/utils/push/signupPushPromptStorage";
import { runDeferredPushPermissionPrompt } from "@/utils/push/runDeferredPushPermissionPrompt";

/**
 * After the post-sign-up paywall closes, ask for notification permission on
 * Home after a short delay.
 *
 * The timer is (re)scheduled on every Home focus while the sign-up push flags
 * are still pending, and cancelled whenever Home blurs (e.g. while the paywall
 * or comparison sheet is on top). Whether the paywall flow actually finished
 * is re-checked at fire time, so a dismissal that raced the flag write only
 * delays the prompt until the next attempt instead of losing it.
 */
export function usePostPaywallNotificationPrompt() {
  const { isHydrated, state } = useApp();
  const userId = state.account?.userId;
  const consumedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!isHydrated || !userId || consumedRef.current) return;

      let cancelled = false;

      void (async () => {
        const [waitsForPaywall, pushPending] = await Promise.all([
          isPushPromptWaitsForPaywall(),
          isPushPermissionPromptPending(),
        ]);

        if (cancelled || consumedRef.current) return;
        if (!waitsForPaywall || !pushPending) return;

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          void runDeferredPushPermissionPrompt()
            .then((consumed) => {
              if (consumed) consumedRef.current = true;
            })
            .catch((error) => {
              console.error(
                "[push] Post-paywall permission setup failed:",
                error instanceof Error ? error.message : error,
              );
            });
        }, POST_PAYWALL_PUSH_PROMPT_DELAY_MS);
      })();

      return () => {
        cancelled = true;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [isHydrated, userId]),
  );
}

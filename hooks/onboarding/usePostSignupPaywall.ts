import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

import { POST_SIGNUP_PAYWALL_DELAY_MS } from "@/constants/onboarding/postSignupFlow";
import { PAYWALL_SOURCE } from "@/constants/analytics/paywall";
import { useApp } from "@/context/AppContext";
import { useIsPremium } from "@/hooks/auth/useIsPremium";
import { openPaywall } from "@/utils/analytics/openPaywall";
import {
  clearPostSignupPaywallPending,
  isPostSignupPaywallPending,
  markPostPaywallFlowComplete,
} from "@/utils/onboarding/postSignupFlowStorage";

/** After sign-up: brief Home preview, then paywall for non-VIP users. */
export function usePostSignupPaywall() {
  const { state, setFlag } = useApp();
  const isPremium = useIsPremium();
  const scheduledRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!state.account?.email || scheduledRef.current) return;

      let cancelled = false;
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      void (async () => {
        const pending = await isPostSignupPaywallPending();
        if (!pending || cancelled) return;

        scheduledRef.current = true;

        if (isPremium) {
          await clearPostSignupPaywallPending();
          await markPostPaywallFlowComplete();
          return;
        }

        timeoutId = setTimeout(() => {
          if (cancelled) return;
          void clearPostSignupPaywallPending();
          setFlag("hasSeenPaywall", true);
          openPaywall(PAYWALL_SOURCE.post_signup, "pushStack");
        }, POST_SIGNUP_PAYWALL_DELAY_MS);
      })();

      return () => {
        cancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [state.account?.email, isPremium, setFlag]),
  );
}

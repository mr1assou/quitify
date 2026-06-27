import { useEffect, useRef } from "react";

import { PUSH_SIGNUP_PROMPT_DELAY_MS } from "@/constants/push/signupPushPrompt";
import { useApp } from "@/context/AppContext";
import { requestPushPermissionAndSaveToken } from "@/services/push/registerPushToken";
import { consumeSignupPushPromptPending } from "@/utils/push/signupPushPromptStorage";

/** After sign-up, waits briefly then asks for notification permission and saves the token. */
export function useSignupPushPrompt() {
  const { isHydrated, state } = useApp();
  const signedIn = isHydrated && Boolean(state.account);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!signedIn || startedRef.current) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    void (async () => {
      const pending = await consumeSignupPushPromptPending();
      if (!pending || cancelled) return;

      startedRef.current = true;

      timeoutId = setTimeout(() => {
        void (async () => {
          try {
            await requestPushPermissionAndSaveToken();
          } catch (error) {
            console.error(
              "[push] Sign-up prompt failed:",
              error instanceof Error ? error.message : error,
            );
          }
        })();
      }, PUSH_SIGNUP_PROMPT_DELAY_MS);
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [signedIn]);
}

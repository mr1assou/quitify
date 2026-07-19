import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { PUSH_PERMISSION_PROMPT_DELAY_MS } from "@/constants/push/signupPushPrompt";
import { useApp } from "@/context/AppContext";
import { setCachedPushTokenStatus } from "@/services/push/pushSettingsCache";
import {
  registerCurrentDevicePushTokenIfAuthorized,
  requestPushPermissionAndSaveToken,
} from "@/services/push/registerPushToken";
import { isPushPromptWaitsForPaywall } from "@/utils/onboarding/postSignupFlowStorage";

function schedulePermissionPrompt(): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    void (async () => {
      try {
        const saved = await requestPushPermissionAndSaveToken();
        setCachedPushTokenStatus(saved);
      } catch (error) {
        console.error(
          "[push] Permission prompt failed:",
          error instanceof Error ? error.message : error,
        );
      }
    })();
  }, PUSH_PERMISSION_PROMPT_DELAY_MS);
}

/**
 * After sign-in:
 * - New sign-up waits for the post-paywall flow.
 * - Existing OS permission reassigns this device token to the current account.
 * - If the OS can still ask, show its permission prompt after 5 seconds.
 */
export function usePushNotificationsOnAuth() {
  const { isHydrated, state } = useApp();
  const userId = state.account?.userId;

  useEffect(() => {
    if (!isHydrated || !userId) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    void (async () => {
      try {
        if (await isPushPromptWaitsForPaywall()) {
          return;
        }

        const permission = await Notifications.getPermissionsAsync();
        if (cancelled) return;

        if (permission.status === "granted") {
          const saved = await registerCurrentDevicePushTokenIfAuthorized();
          if (!cancelled) setCachedPushTokenStatus(saved);
          return;
        }

        setCachedPushTokenStatus(false);
        if (permission.canAskAgain) {
          timeoutId = schedulePermissionPrompt();
        }
      } catch (error) {
        console.error(
          "[push] Auth push setup failed:",
          error instanceof Error ? error.message : error,
        );
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isHydrated, userId]);
}

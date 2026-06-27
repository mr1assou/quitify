import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { PUSH_PERMISSION_PROMPT_DELAY_MS } from "@/constants/push/signupPushPrompt";
import { useApp } from "@/context/AppContext";
import { fetchPushTokenStatus } from "@/services/push/pushTokenApi";
import {
  getCachedPushTokenStatus,
  setCachedPushTokenStatus,
} from "@/services/push/pushSettingsCache";
import {
  requestPushPermissionAndSaveToken,
  syncPushTokenWithBackend,
} from "@/services/push/registerPushToken";
import {
  clearPushPermissionPromptPending,
  isPushPermissionPromptPending,
} from "@/utils/push/signupPushPromptStorage";

function schedulePermissionPrompt(
  onDone: () => void,
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    void (async () => {
      try {
        await clearPushPermissionPromptPending();
        const saved = await requestPushPermissionAndSaveToken();
        setCachedPushTokenStatus(saved);
      } catch (error) {
        console.error(
          "[push] Permission prompt failed:",
          error instanceof Error ? error.message : error,
        );
      } finally {
        onDone();
      }
    })();
  }, PUSH_PERMISSION_PROMPT_DELAY_MS);
}

async function refreshCachedPushTokenStatus(): Promise<void> {
  try {
    const hasToken = await fetchPushTokenStatus();
    setCachedPushTokenStatus(hasToken);
  } catch {
    // Keep the last cached toggle state if the API is unreachable.
  }
}

/**
 * After sign-in:
 * - New sign-up → OS permission prompt after 5s
 * - Fresh install / reinstall where the OS has never been asked (status
 *   `undetermined`) → OS permission prompt after 5s, even if notifications were off
 * - Re-login with notifications previously on but OS permission lost → same prompt
 * - OS permission explicitly denied (and not a new sign-up) → no auto-prompt
 * - Otherwise sync push token only
 */
export function usePushNotificationsOnAuth() {
  const { isHydrated, state } = useApp();
  const accountEmail = state.account?.email;

  useEffect(() => {
    if (!isHydrated || !accountEmail) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    void (async () => {
      try {
        const promptPending = await isPushPermissionPromptPending();

        let hadTokenInDb = false;
        try {
          hadTokenInDb = await fetchPushTokenStatus();
        } catch (error) {
          console.error(
            "[push] Could not load push token status:",
            error instanceof Error ? error.message : error,
          );
          return;
        }

        if (getCachedPushTokenStatus() === null) {
          setCachedPushTokenStatus(hadTokenInDb);
        }

        const { status: osStatus } = await Notifications.getPermissionsAsync();

        // `undetermined` = OS has never asked on this install (fresh / reinstall),
        // so it's safe to prompt regardless of the stored toggle. We only avoid
        // auto-prompting when the user explicitly denied at the OS level.
        const osNeverAsked = osStatus === "undetermined";

        const shouldPrompt =
          !cancelled &&
          (promptPending ||
            osNeverAsked ||
            (hadTokenInDb && osStatus !== "granted"));

        if (shouldPrompt) {
          timeoutId = schedulePermissionPrompt(() => {
            void syncPushTokenWithBackend()
              .then(() => refreshCachedPushTokenStatus())
              .catch(() => {});
          });
          return;
        }

        await syncPushTokenWithBackend();
        if (!cancelled) {
          await refreshCachedPushTokenStatus();
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
  }, [isHydrated, accountEmail]);
}

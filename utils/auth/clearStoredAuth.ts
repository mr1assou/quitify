import { fetchLogout } from "@/services/auth";
import { cancelMotivationLocalNotifications } from "@/services/push/motivationLocalNotifications";
import { clearPushTokensOnBackend } from "@/services/push/pushTokenApi";
import { resetCachedPushTokenStatus } from "@/services/push/pushSettingsCache";
import { disconnectPresenceSocket } from "@/services/realtime/presenceSocket";
import { clearAuthTokens, getAccessToken } from "@/utils/auth/authStorage";
import { clearAppSession } from "@/utils/auth/sessionStorage";
import { clearPostSignupFlowFlags } from "@/utils/onboarding/postSignupFlowStorage";
import { clearPushPermissionPromptPending } from "@/utils/push/signupPushPromptStorage";

/** Clears tokens, persisted session, and invalidates the server refresh token. */
export async function clearStoredAuth(): Promise<void> {
  disconnectPresenceSocket();

  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      await clearPushTokensOnBackend();
    } catch {
      // The next sign-in still reassigns this device token to the new account.
    }

    try {
      await fetchLogout(accessToken);
    } catch {
      // Local sign-out still proceeds if the API is unreachable.
    }
  }

  await Promise.all([
    clearAuthTokens(),
    clearAppSession(),
    clearPostSignupFlowFlags(),
    clearPushPermissionPromptPending(),
    cancelMotivationLocalNotifications(),
  ]);
  resetCachedPushTokenStatus();
}

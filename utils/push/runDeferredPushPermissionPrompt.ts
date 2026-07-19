import { setCachedPushTokenStatus } from "@/services/push/pushSettingsCache";
import { requestPushPermissionAndSaveToken } from "@/services/push/registerPushToken";
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
 * Runs the OS notification prompt after the post-sign-up paywall flow.
 *
 * Returns true when the prompt flow ran (whatever the user answered), and
 * false when it is not due yet — e.g. the paywall has not finished, so the
 * caller should try again on a later focus.
 */
export async function runDeferredPushPermissionPrompt(): Promise<boolean> {
  if (!(await isPushPermissionPromptPending())) return false;
  if (!(await isPushPromptWaitsForPaywall())) return false;
  if (!(await isPostPaywallFlowComplete())) return false;

  try {
    const saved = await requestPushPermissionAndSaveToken();
    setCachedPushTokenStatus(saved);
    await clearPushPermissionPromptPending();
  } finally {
    // The paywall flow is over even if token registration needs a later
    // retry; usePushNotificationsOnAuth recovers it on the next app start.
    await clearPostSignupFlowFlags();
  }
  return true;
}

import * as Notifications from "expo-notifications";

import { setCachedPushTokenStatus } from "@/services/push/pushSettingsCache";
import { requestPushPermissionAndSaveToken } from "@/services/push/registerPushToken";
import {
  clearPostPaywallFlowComplete,
  clearPostSignupFlowFlags,
  clearPushPromptWaitsForPaywall,
  isPostPaywallFlowComplete,
  isPushPromptWaitsForPaywall,
} from "@/utils/onboarding/postSignupFlowStorage";
import {
  clearPushPermissionPromptPending,
  isPushPermissionPromptPending,
} from "@/utils/push/signupPushPromptStorage";

/** Runs the OS notification prompt after the post-sign-up paywall flow. */
export async function runDeferredPushPermissionPrompt(): Promise<boolean> {
  if (!(await isPushPermissionPromptPending())) return false;
  if (!(await isPushPromptWaitsForPaywall())) return false;
  if (!(await isPostPaywallFlowComplete())) return false;

  const { status } = await Notifications.getPermissionsAsync();
  if (status === "denied") {
    await clearPushPermissionPromptPending();
    await clearPostSignupFlowFlags();
    await clearPushPromptWaitsForPaywall();
    return false;
  }

  await clearPushPermissionPromptPending();
  await clearPostSignupFlowFlags();
  await clearPushPromptWaitsForPaywall();

  const saved = await requestPushPermissionAndSaveToken();
  setCachedPushTokenStatus(saved);
  return true;
}

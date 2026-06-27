import AsyncStorage from "@react-native-async-storage/async-storage";

import { PUSH_SIGNUP_PROMPT_STORAGE_KEY } from "@/constants/push/signupPushPrompt";

export async function markPushPermissionPromptPending(): Promise<void> {
  await AsyncStorage.setItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY, "1");
}

/** @deprecated Use markPushPermissionPromptPending */
export const markSignupPushPromptPending = markPushPermissionPromptPending;

export async function isPushPermissionPromptPending(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY);
  return value === "1";
}

export async function clearPushPermissionPromptPending(): Promise<void> {
  await AsyncStorage.removeItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY);
}

/** @deprecated Use isPushPermissionPromptPending */
export const consumePushPermissionPromptPending = isPushPermissionPromptPending;

/** @deprecated Use isPushPermissionPromptPending */
export const consumeSignupPushPromptPending = isPushPermissionPromptPending;

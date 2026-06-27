import AsyncStorage from "@react-native-async-storage/async-storage";

import { PUSH_SIGNUP_PROMPT_STORAGE_KEY } from "@/constants/push/signupPushPrompt";

export async function markSignupPushPromptPending(): Promise<void> {
  await AsyncStorage.setItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY, "1");
}

export async function consumeSignupPushPromptPending(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY);
  if (value !== "1") return false;
  await AsyncStorage.removeItem(PUSH_SIGNUP_PROMPT_STORAGE_KEY);
  return true;
}

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  POST_PAYWALL_FLOW_COMPLETE_KEY,
  POST_SIGNUP_PAYWALL_PENDING_KEY,
  PUSH_PROMPT_WAITS_FOR_PAYWALL_KEY,
} from "@/constants/onboarding/postSignupFlow";
import { PUSH_SIGNUP_PROMPT_STORAGE_KEY } from "@/constants/push/signupPushPrompt";

/** New sign-up: show paywall on Home, then defer push permission until paywall ends. */
export async function markPostSignupFlowPending(): Promise<void> {
  await AsyncStorage.multiSet([
    [POST_SIGNUP_PAYWALL_PENDING_KEY, "1"],
    [PUSH_SIGNUP_PROMPT_STORAGE_KEY, "1"],
    [PUSH_PROMPT_WAITS_FOR_PAYWALL_KEY, "1"],
  ]);
}

export async function isPostSignupPaywallPending(): Promise<boolean> {
  return (await AsyncStorage.getItem(POST_SIGNUP_PAYWALL_PENDING_KEY)) === "1";
}

export async function clearPostSignupPaywallPending(): Promise<void> {
  await AsyncStorage.removeItem(POST_SIGNUP_PAYWALL_PENDING_KEY);
}

export async function markPostPaywallFlowComplete(): Promise<void> {
  await AsyncStorage.setItem(POST_PAYWALL_FLOW_COMPLETE_KEY, "1");
}

export async function isPostPaywallFlowComplete(): Promise<boolean> {
  return (await AsyncStorage.getItem(POST_PAYWALL_FLOW_COMPLETE_KEY)) === "1";
}

export async function clearPostPaywallFlowComplete(): Promise<void> {
  await AsyncStorage.removeItem(POST_PAYWALL_FLOW_COMPLETE_KEY);
}

export async function isPushPromptWaitsForPaywall(): Promise<boolean> {
  return (await AsyncStorage.getItem(PUSH_PROMPT_WAITS_FOR_PAYWALL_KEY)) === "1";
}

export async function clearPushPromptWaitsForPaywall(): Promise<void> {
  await AsyncStorage.removeItem(PUSH_PROMPT_WAITS_FOR_PAYWALL_KEY);
}

export async function clearPostSignupFlowFlags(): Promise<void> {
  await AsyncStorage.multiRemove([
    POST_SIGNUP_PAYWALL_PENDING_KEY,
    POST_PAYWALL_FLOW_COMPLETE_KEY,
    PUSH_PROMPT_WAITS_FOR_PAYWALL_KEY,
  ]);
}

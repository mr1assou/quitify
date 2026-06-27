import { useSignupPushPrompt } from "@/hooks/push/useSignupPushPrompt";

/** Schedules the post-sign-up notification permission prompt. */
export function SignupPushPromptBridge() {
  useSignupPushPrompt();
  return null;
}

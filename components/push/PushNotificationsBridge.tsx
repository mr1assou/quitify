import { usePushTokenSync } from "@/hooks/push/usePushTokenSync";
import { useSignupPushPrompt } from "@/hooks/push/useSignupPushPrompt";

/** Post-sign-up permission prompt + push token sync after reinstall. */
export function PushNotificationsBridge() {
  useSignupPushPrompt();
  usePushTokenSync();
  return null;
}

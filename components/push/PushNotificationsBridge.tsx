import { usePushNotificationsOnAuth } from "@/hooks/push/usePushNotificationsOnAuth";
import { useChatPushNotificationResponse } from "@/hooks/push/useChatPushNotificationResponse";

/** Sign-up / re-login push permission prompt + token sync. */
export function PushNotificationsBridge() {
  usePushNotificationsOnAuth();
  useChatPushNotificationResponse();
  return null;
}

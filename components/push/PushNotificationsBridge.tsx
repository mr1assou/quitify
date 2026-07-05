import { usePushNotificationsOnAuth } from "@/hooks/push/usePushNotificationsOnAuth";
import { useMotivationLocalNotifications } from "@/hooks/push/useMotivationLocalNotifications";
import { useChatPushNotificationResponse } from "@/hooks/push/useChatPushNotificationResponse";

/** Sign-up / re-login push permission prompt + token sync + local motivation schedule. */
export function PushNotificationsBridge() {
  usePushNotificationsOnAuth();
  useMotivationLocalNotifications();
  useChatPushNotificationResponse();
  return null;
}

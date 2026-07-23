import { usePushNotificationsOnAuth } from "@/hooks/push/usePushNotificationsOnAuth";
import { useMotivationLocalNotifications } from "@/hooks/push/useMotivationLocalNotifications";
import { useChatPushNotificationResponse } from "@/hooks/push/useChatPushNotificationResponse";
import { usePushSettingsHydration } from "@/hooks/push/usePushSettingsHydration";

/** Sign-up / re-login push permission prompt + token sync + local motivation schedule. */
export function PushNotificationsBridge() {
  usePushSettingsHydration();
  usePushNotificationsOnAuth();
  useMotivationLocalNotifications();
  useChatPushNotificationResponse();
  return null;
}

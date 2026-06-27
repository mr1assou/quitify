import { usePushNotificationsOnAuth } from "@/hooks/push/usePushNotificationsOnAuth";

/** Sign-up / re-login push permission prompt + token sync. */
export function PushNotificationsBridge() {
  usePushNotificationsOnAuth();
  return null;
}

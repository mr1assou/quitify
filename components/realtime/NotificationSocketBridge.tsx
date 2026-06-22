import { useNotificationSocket } from "@/hooks/notifications/useNotificationSocket";

/** Invisible bridge — mounts notification WebSocket lifecycle inside providers. */
export function NotificationSocketBridge() {
  useNotificationSocket();
  return null;
}

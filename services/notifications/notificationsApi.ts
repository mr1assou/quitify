import { authenticatedFetch } from "@/services/api/authenticatedFetch";
import type {
  BackendNotificationsPage,
  BackendUnreadCount,
} from "@/types/notifications/notification";

export const NOTIFICATIONS_PAGE_SIZE = 10;

export async function fetchNotifications(
  offset = 0,
  limit = NOTIFICATIONS_PAGE_SIZE,
): Promise<BackendNotificationsPage> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  const res = await authenticatedFetch(`/notifications?${params.toString()}`);
  if (!res.ok) throw new Error("Could not load notifications");
  return res.json() as Promise<BackendNotificationsPage>;
}

export async function fetchNotificationsUnreadCount(): Promise<BackendUnreadCount> {
  const res = await authenticatedFetch("/notifications/unread-count");
  if (!res.ok) throw new Error("Could not load unread count");
  return res.json() as Promise<BackendUnreadCount>;
}

export async function markAllNotificationsRead(): Promise<BackendUnreadCount> {
  const res = await authenticatedFetch("/notifications/read", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Could not mark notifications read");
  return res.json() as Promise<BackendUnreadCount>;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<BackendUnreadCount> {
  const res = await authenticatedFetch(
    `/notifications/${notificationId}/read`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error("Could not mark notification read");
  return res.json() as Promise<BackendUnreadCount>;
}

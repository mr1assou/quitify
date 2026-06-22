import type {
  AppNotification,
  BackendNotification,
} from "@/types/notifications/notification";

export function mapBackendNotification(
  notification: BackendNotification,
): AppNotification {
  return {
    id: String(notification.notification_id),
    type: notification.type,
    actorUserId: notification.actor.user_id,
    actorName: notification.actor.username?.trim() || "Someone",
    actorImageUrl: notification.actor.image_url ?? undefined,
    actorCountryFlag: notification.actor.country_flag ?? undefined,
    postId: notification.post_id != null ? String(notification.post_id) : null,
    commentId:
      notification.comment_id != null ? String(notification.comment_id) : null,
    text: notification.text,
    isRead: notification.is_read,
    createdAt: Date.parse(notification.created_at),
  };
}

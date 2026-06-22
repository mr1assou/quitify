export type NotificationType =
  | "comment"
  | "reply"
  | "upvote"
  | "downvote"
  | "post";

export type BackendNotificationActor = {
  user_id: number;
  username: string | null;
  image_url: string | null;
  country_flag: string | null;
};

export type BackendNotification = {
  notification_id: number;
  type: NotificationType;
  actor: BackendNotificationActor;
  post_id: number | null;
  comment_id: number | null;
  text: string | null;
  is_read: boolean;
  created_at: string;
};

export type BackendNotificationsPage = {
  items: BackendNotification[];
  has_more: boolean;
  unread_count: number;
};

export type BackendUnreadCount = {
  unread_count: number;
};

/** Client-side notification model. */
export type AppNotification = {
  id: string;
  type: NotificationType;
  actorUserId: number;
  actorName: string;
  actorImageUrl?: string;
  actorCountryFlag?: string;
  postId: string | null;
  commentId: string | null;
  text: string | null;
  isRead: boolean;
  createdAt: number;
};

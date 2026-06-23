export type BackendChatMessageType = "text" | "image" | "video" | "audio";

export type BackendChatMessage = {
  message_id: number;
  thread_id: number;
  sender_id: number;
  message_type: BackendChatMessageType;
  text: string | null;
  media_url: string | null;
  media_mime_type: string | null;
  media_duration_ms: number | null;
  media_size_bytes: number | null;
  is_deleted: boolean;
  edited_at: string | null;
  created_at: string;
};

export type BackendChatThreadSummary = {
  thread_id: number;
  peer_user_id: number;
  peer_username: string | null;
  peer_image_url: string | null;
  peer_country_flag: string | null;
  peer_role?: string;
  last_message: BackendChatMessage | null;
  unread_count: number;
  peer_last_read_at: string | null;
  updated_at: string;
};

export type BackendChatMessagesPage = {
  items: BackendChatMessage[];
  has_more: boolean;
  peer_last_read_at: string | null;
};

export type BackendMessagesSeenPayload = {
  thread_id: number;
  reader_user_id: number;
  last_read_at: string;
};

export type BackendChatTypingPayload = {
  thread_id: number;
  user_id: number;
  is_typing: boolean;
};

export type BackendChatUploadUrl = {
  uploadUrl: string;
  imageUrl: string;
  key: string;
  expiresIn: number;
};

export type BackendSupportUser = {
  user_id: number;
  username: string | null;
  image_url: string | null;
  country_flag: string | null;
  role?: string;
};

export type BackendSupportUsersPage = {
  items: BackendSupportUser[];
  has_more: boolean;
};

export type SendChatMessagePayload = {
  message_type: BackendChatMessageType;
  text?: string;
  media_url?: string;
  media_mime_type?: string;
  media_duration_ms?: number;
  media_size_bytes?: number;
};

export type EditChatMessagePayload = {
  text: string;
};

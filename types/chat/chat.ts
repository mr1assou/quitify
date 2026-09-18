export type ChatMessageKind = "text" | "image" | "video" | "audio" | "call" | "system";

/** Read receipt for outgoing messages (from peer's last_read_at). */
export type MessageReadStatus = "seen" | "unseen";

export type ChatMessage = {
  id: string;
  /** Stays the same when an optimistic send is swapped for the server id. */
  clientKey?: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: number;
  kind: ChatMessageKind;
  mediaUrl?: string;
  mediaMimeType?: string;
  mediaDurationMs?: number;
  readStatus?: MessageReadStatus;
  isDeleted?: boolean;
  editedAt?: number;
};

export type ChatThread = {
  id: string;
  /** Other participant id (1:1 chats only for now). */
  participantId: string;
  /** Ordered message ids (oldest → newest). */
  messageIds: string[];
  /** Last time the current user read this thread (epoch ms). */
  lastReadAt: number;
  /** When the peer last read messages in this thread. */
  peerLastReadAt?: number;
  unreadCount?: number;
  /** Whether older messages exist before the loaded window. */
  hasMoreMessages?: boolean;
};

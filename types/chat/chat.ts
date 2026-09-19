export type ChatMessageKind = "text" | "image" | "video" | "audio" | "call" | "system";

/** Read receipt for outgoing messages (from peer's last_read_at). */
export type MessageReadStatus = "seen" | "unseen";

/**
 * Local-first delivery state (WhatsApp-style):
 * pending = saved on device, not yet accepted by the server;
 * failed = server rejected / offline, will retry from the outbox;
 * sent = server has it.
 */
export type MessageSyncStatus = "pending" | "sent" | "failed";

export type ChatMessage = {
  id: string;
  /** Stays the same when an optimistic send is swapped for the server id. */
  clientKey?: string;
  /** Missing means "sent" (history from the server). */
  syncStatus?: MessageSyncStatus;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: number;
  kind: ChatMessageKind;
  mediaUrl?: string;
  mediaMimeType?: string;
  mediaDurationMs?: number;
  mediaSizeBytes?: number;
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

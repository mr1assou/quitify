export type ChatMessageKind = "text" | "system";

/** UI-only read receipt for outgoing messages. */
export type MessageReadStatus = "seen" | "unseen";

export type ChatMessage = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: number;
  kind: ChatMessageKind;
  /** Mock read receipt — only meaningful on messages sent by the current user. */
  readStatus?: MessageReadStatus;
};

export type ChatThread = {
  id: string;
  /** Other participant id (1:1 chats only for now). */
  participantId: string;
  /** Ordered message ids (oldest → newest). */
  messageIds: string[];
  /** Last time the current user opened this thread. */
  lastReadAt: number;
};

export type CallKind = "audio" | "video";

export type CallSession = {
  threadId: string;
  participantId: string;
  kind: CallKind;
  /** Epoch ms when the call started. */
  startedAt: number;
};

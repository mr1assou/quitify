import type { ChatMessage, MessageReadStatus } from "@/types/chat/chat";

/** Seen when the peer's read cursor is at or after this message. */
export function resolveOutgoingReadStatus(
  message: ChatMessage,
  peerLastReadAt?: number,
): MessageReadStatus {
  if (!peerLastReadAt) return "unseen";
  return message.createdAt <= peerLastReadAt ? "seen" : "unseen";
}

import type { ChatMessage, MessageReadStatus } from "@/types/chat";

/** UI-only: seen if the other person sent a message after this one. */
export function resolveOutgoingReadStatus(
  message: ChatMessage,
  messages: ChatMessage[],
): MessageReadStatus {
  if (message.readStatus) return message.readStatus;

  const index = messages.findIndex((row) => row.id === message.id);
  if (index < 0) return "unseen";

  const hasReplyAfter = messages
    .slice(index + 1)
    .some((row) => row.senderId !== message.senderId);

  return hasReplyAfter ? "seen" : "unseen";
}

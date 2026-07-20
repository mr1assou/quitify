import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import { CHAT_MESSAGE_EDIT_WINDOW_MS } from "@/constants/chat/chatMessageMutation";
import type { ChatMessage } from "@/types/chat/chat";
import { parseSharedPostChatMessage } from "@/utils/chat/sharedPostMessage";

function isOwnActiveMessage(message: ChatMessage): boolean {
  if (message.senderId !== CURRENT_USER_ID) return false;
  if (message.isDeleted) return false;
  if (message.id.startsWith("temp-")) return false;
  return true;
}

export function canDeleteChatMessage(message: ChatMessage): boolean {
  if (message.kind === "call") return false;
  return isOwnActiveMessage(message);
}

export function canEditChatMessage(message: ChatMessage): boolean {
  return (
    isOwnActiveMessage(message) &&
    message.kind === "text" &&
    Date.now() - message.createdAt <= CHAT_MESSAGE_EDIT_WINDOW_MS
  );
}

export function canShowChatMessageActions(message: ChatMessage): boolean {
  return canDeleteChatMessage(message);
}

export function formatChatMessagePreview(message: ChatMessage): string {
  if (message.isDeleted) return "Message deleted";
  if (message.kind === "call") return "Call";
  if (message.text.trim()) {
    if (parseSharedPostChatMessage(message.text)) return "Shared a community post";
    return message.text;
  }
  if (message.kind === "image") return "📷 Photo";
  if (message.kind === "video") return "🎥 Video";
  if (message.kind === "audio") return "🎤 Voice message";
  return "Message";
}

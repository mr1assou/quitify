import { CURRENT_USER_ID } from "@/constants/communityUsers";
import type { ChatMessage, ChatThread } from "@/types/chat";
import type {
  BackendChatMessage,
  BackendChatThreadSummary,
} from "@/types/chatApi";
import type { CommunityUser } from "@/types/community";
import { dbAuthorId } from "@/utils/community/presence";

export function senderIdFromBackend(
  senderId: number,
  currentUserId: number,
): string {
  return senderId === currentUserId ? CURRENT_USER_ID : dbAuthorId(senderId);
}

export function mapBackendMessage(
  message: BackendChatMessage,
  currentUserId: number,
): ChatMessage {
  return {
    id: String(message.message_id),
    threadId: String(message.thread_id),
    senderId: senderIdFromBackend(message.sender_id, currentUserId),
    text: message.text ?? "",
    kind: message.message_type,
    createdAt: Date.parse(message.created_at),
    mediaUrl: message.media_url ?? undefined,
    mediaMimeType: message.media_mime_type ?? undefined,
    mediaDurationMs: message.media_duration_ms ?? undefined,
  };
}

export function mapPeerToCommunityUser(
  summary: BackendChatThreadSummary,
): CommunityUser {
  const id = dbAuthorId(summary.peer_user_id);
  return {
    id,
    name: summary.peer_username?.trim() || "User",
    handle: summary.peer_username?.trim() || "user",
    bio: "",
    smokeFreeDays: 0,
    badgeId: "first-step",
    countryFlag: summary.peer_country_flag ?? "🌍",
    avatarRank: 1,
    leaderboardRank: 0,
    avatarUrl: summary.peer_image_url ?? undefined,
  };
}

export function mapBackendThreadSummary(
  summary: BackendChatThreadSummary,
  currentUserId: number,
): { thread: ChatThread; participant: CommunityUser; messages: ChatMessage[] } {
  const participant = mapPeerToCommunityUser(summary);
  const messages = summary.last_message
    ? [mapBackendMessage(summary.last_message, currentUserId)]
    : [];

  return {
    thread: {
      id: String(summary.thread_id),
      participantId: participant.id,
      messageIds: messages.map((message) => message.id),
      lastReadAt: Date.now(),
      peerLastReadAt: summary.peer_last_read_at
        ? Date.parse(summary.peer_last_read_at)
        : undefined,
      unreadCount: summary.unread_count,
    },
    participant,
    messages,
  };
}

import { DEFAULT_USER_ROLE, type UserRole } from "@/constants/auth/userRoles";
import { CURRENT_USER_ID } from "@/constants/community/communityUsers";
import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import type { ChatMessage, ChatThread } from "@/types/chat/chat";
import type {
  BackendChatMessage,
  BackendChatThreadSummary,
  BackendSupportUser,
} from "@/types/chat/chatApi";
import type { CommunityUser } from "@/types/community/community";
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
    isDeleted: message.is_deleted,
    editedAt: message.edited_at ? Date.parse(message.edited_at) : undefined,
  };
}

export function mapPeerToCommunityUser(
  summary: BackendChatThreadSummary,
): CommunityUser {
  const id = dbAuthorId(summary.peer_user_id);
  const handle = summary.peer_username?.trim() || "user";
  const role = (summary.peer_role ?? DEFAULT_USER_ROLE) as UserRole;
  const countryFlag =
    resolveCountryFlagUrl(summary.peer_country_flag ?? undefined) ??
    countryFlagForRank(1);
  return {
    id,
    name: handle,
    handle,
    bio: "",
    smokeFreeDays: 0,
    badgeId: "first-step",
    countryFlag,
    avatarRank: 1,
    leaderboardRank: 0,
    avatarUrl: summary.peer_image_url ?? undefined,
    role,
  };
}

export function mapSupportUserToCommunityUser(user: BackendSupportUser): CommunityUser {
  const id = dbAuthorId(user.user_id);
  const handle = user.username?.trim() || "user";
  const role = (user.role ?? DEFAULT_USER_ROLE) as UserRole;
  const countryFlag =
    resolveCountryFlagUrl(user.country_flag ?? undefined) ?? countryFlagForRank(1);
  return {
    id,
    name: handle,
    handle,
    bio: "",
    smokeFreeDays: 0,
    badgeId: "first-step",
    countryFlag,
    avatarRank: 1,
    leaderboardRank: 0,
    avatarUrl: user.image_url ?? undefined,
    role,
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

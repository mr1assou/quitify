import { isSupportStaffUser } from "@/constants/auth/userRoles";
import type { ChatMessage } from "@/types/chat/chat";
import type { CommunityUser } from "@/types/community/community";

/** Messages that count toward a real chat exchange (excludes calls, system, deleted). */
function isConversationMessage(message: ChatMessage): boolean {
  return (
    !message.isDeleted && message.kind !== "system" && message.kind !== "call"
  );
}

/** True when the current user has sent at least one message in this thread. */
export function currentUserHasSentInThread(
  messages: readonly ChatMessage[],
): boolean {
  return messages.some(
    (message) => message.senderId === "me" && isConversationMessage(message),
  );
}

/** True when the other person has sent at least one message in this thread. */
export function peerHasInitiatedChat(messages: readonly ChatMessage[]): boolean {
  return messages.some(
    (message) => message.senderId !== "me" && isConversationMessage(message),
  );
}

/** True when both users have sent at least one message in this thread. */
export function hasMutualChat(messages: readonly ChatMessage[]): boolean {
  return (
    currentUserHasSentInThread(messages) && peerHasInitiatedChat(messages)
  );
}

/** Free users may reply in support chats or after the peer messaged first. */
export function canFreeUserSendInThread(
  messages: readonly ChatMessage[],
  participant: CommunityUser | undefined,
): boolean {
  if (participant && isSupportStaffUser(participant)) return true;
  return peerHasInitiatedChat(messages);
}

export function canSendChatMessage(
  isPremium: boolean,
  messages: readonly ChatMessage[],
  participant: CommunityUser | undefined,
): boolean {
  if (isPremium) return true;
  return canFreeUserSendInThread(messages, participant);
}

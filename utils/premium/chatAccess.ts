import { isSupportStaffUser } from "@/constants/auth/userRoles";
import type { ChatMessage } from "@/types/chat/chat";
import type { CommunityUser } from "@/types/community/community";

/** True when the other person has sent at least one message in this thread. */
export function peerHasInitiatedChat(messages: readonly ChatMessage[]): boolean {
  return messages.some(
    (message) =>
      message.senderId !== "me" && !message.isDeleted && message.kind !== "system",
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

/** Starting a call always requires premium. Answering is handled on the incoming-call flow. */
export function canInitiateCall(isPremium: boolean): boolean {
  return isPremium;
}

export function canSendChatMessage(
  isPremium: boolean,
  messages: readonly ChatMessage[],
  participant: CommunityUser | undefined,
): boolean {
  if (isPremium) return true;
  return canFreeUserSendInThread(messages, participant);
}

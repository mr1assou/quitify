import { useMemo } from "react";

import { getCommunityUser } from "@/constants/communityUsers";
import { useCommunity } from "@/context/CommunityContext";
import type { ChatMessage } from "@/types/chat";
import type { CommunityUser } from "@/types/community";

export type ChatThreadPreview = {
  threadId: string;
  participant: CommunityUser;
  lastMessage: ChatMessage | null;
  unreadCount: number;
};

/** Chat list — threads sorted by most recent activity. */
export function useChatThreads(): ChatThreadPreview[] {
  const { state } = useCommunity();

  return useMemo(() => {
    return state.threads
      .map<ChatThreadPreview | null>((thread) => {
        const participant = getCommunityUser(thread.participantId);
        if (!participant) return null;

        const messages = thread.messageIds
          .map((mid) => state.messagesById[mid])
          .filter((m): m is ChatMessage => Boolean(m));

        const lastMessage = messages[messages.length - 1] ?? null;
        const unreadCount = messages.filter(
          (m) => m.senderId !== "me" && m.createdAt > thread.lastReadAt,
        ).length;

        return { threadId: thread.id, participant, lastMessage, unreadCount };
      })
      .filter((t): t is ChatThreadPreview => t !== null)
      .sort((a, b) => {
        const at = a.lastMessage?.createdAt ?? 0;
        const bt = b.lastMessage?.createdAt ?? 0;
        return bt - at;
      });
  }, [state.threads, state.messagesById]);
}

export type ChatThreadDetail = {
  threadId: string;
  participant: CommunityUser;
  messages: ChatMessage[];
};

export function useChatThread(threadId: string): ChatThreadDetail | null {
  const { state } = useCommunity();

  return useMemo(() => {
    const thread = state.threads.find((t) => t.id === threadId);
    if (!thread) return null;
    const participant = getCommunityUser(thread.participantId);
    if (!participant) return null;

    const messages = thread.messageIds
      .map((mid) => state.messagesById[mid])
      .filter((m): m is ChatMessage => Boolean(m));

    return { threadId: thread.id, participant, messages };
  }, [threadId, state.threads, state.messagesById]);
}

/** Total unread across all threads (for badges). */
export function useChatUnreadTotal(): number {
  const threads = useChatThreads();
  return threads.reduce((sum, t) => sum + t.unreadCount, 0);
}

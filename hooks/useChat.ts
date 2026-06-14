import { useMemo } from "react";

import { useCommunity } from "@/context/CommunityContext";
import type { ChatMessage, MessageReadStatus } from "@/types/chat";
import type { CommunityUser } from "@/types/community";
import { resolveOutgoingReadStatus } from "@/utils/chat/resolveOutgoingReadStatus";
import { resolveChatParticipant } from "@/utils/chat/resolveChatParticipant";
import { getLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";

export type ChatThreadPreview = {
  threadId: string;
  participant: CommunityUser;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  lastOutgoingReadStatus?: MessageReadStatus;
};

/** Chat list — threads sorted by most recent activity. */
export function useChatThreads(): ChatThreadPreview[] {
  const { state } = useCommunity();
  const leaderboard = getLeaderboardCache();

  return useMemo(() => {
    return state.threads
      .map<ChatThreadPreview | null>((thread) => {
        const participant =
          resolveChatParticipant(
            thread.participantId,
            state.authorsById,
            leaderboard,
          ) ?? state.authorsById[thread.participantId] ?? null;
        if (!participant) return null;

        const messages = thread.messageIds
          .map((mid) => state.messagesById[mid])
          .filter((m): m is ChatMessage => Boolean(m));

        const lastMessage = messages[messages.length - 1] ?? null;
        const unreadCount =
          thread.unreadCount ??
          messages.filter(
            (m) => m.senderId !== "me" && m.createdAt > thread.lastReadAt,
          ).length;
        const lastOutgoingReadStatus =
          lastMessage?.senderId === "me"
            ? resolveOutgoingReadStatus(lastMessage, thread.peerLastReadAt)
            : undefined;

        return {
          threadId: thread.id,
          participant,
          lastMessage,
          unreadCount,
          lastOutgoingReadStatus,
        };
      })
      .filter((t): t is ChatThreadPreview => t !== null)
      .sort((a, b) => {
        const at = a.lastMessage?.createdAt ?? 0;
        const bt = b.lastMessage?.createdAt ?? 0;
        return bt - at;
      });
  }, [leaderboard, state.authorsById, state.messagesById, state.threads]);
}

export type ChatThreadDetail = {
  threadId: string;
  participant: CommunityUser;
  messages: ChatMessage[];
  peerLastReadAt?: number;
};

export function useChatThread(threadId: string): ChatThreadDetail | null {
  const { state } = useCommunity();
  const leaderboard = getLeaderboardCache();

  return useMemo(() => {
    const thread = state.threads.find((t) => t.id === threadId);
    if (!thread) return null;

    const participant =
      resolveChatParticipant(
        thread.participantId,
        state.authorsById,
        leaderboard,
      ) ?? state.authorsById[thread.participantId] ?? null;
    if (!participant) return null;

    const messages = thread.messageIds
      .map((mid) => state.messagesById[mid])
      .filter((m): m is ChatMessage => Boolean(m))
      .sort((a, b) => a.createdAt - b.createdAt);

    return {
      threadId: thread.id,
      participant,
      messages,
      peerLastReadAt: thread.peerLastReadAt,
    };
  }, [leaderboard, threadId, state.authorsById, state.messagesById, state.threads]);
}

/** Total unread across all threads (for badges). */
export function useChatUnreadTotal(): number {
  const threads = useChatThreads();
  return threads.reduce((sum, t) => sum + t.unreadCount, 0);
}

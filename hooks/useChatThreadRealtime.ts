import { useCallback, useEffect, useRef, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import type { BackendChatMessage } from "@/types/chatApi";
import {
  addChatSocketListener,
  emitChatMarkSeen,
  emitChatTyping,
} from "@/services/realtime/chatSocket";

const TYPING_STOP_MS = 2500;

/** Real-time typing + auto-read while the chat room is open. */
export function useChatThreadRealtime(threadId: string) {
  const { state: appState } = useApp();
  const userId = appState.account?.userId ?? null;
  const { markThreadRead } = useCommunity();
  const [peerTyping, setPeerTyping] = useState(false);
  const typingStopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSent = useRef<boolean | null>(null);

  const markSeenNow = useCallback(() => {
    if (!threadId) return;
    void markThreadRead(threadId);
    emitChatMarkSeen(Number(threadId));
  }, [markThreadRead, threadId]);

  useEffect(() => {
    if (!threadId || !userId) return;

    const removeTyping = addChatSocketListener("onTyping", (payload) => {
      if (String(payload.thread_id) !== threadId) return;
      if (payload.user_id === userId) return;
      setPeerTyping(payload.is_typing);
    });

    const removeMessage = addChatSocketListener("onMessage", (payload: BackendChatMessage) => {
      if (String(payload.thread_id) !== threadId) return;
      if (payload.sender_id === userId) return;
      markSeenNow();
    });

    return () => {
      removeTyping();
      removeMessage();
      setPeerTyping(false);
      if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
      emitChatTyping(Number(threadId), false);
      lastTypingSent.current = null;
    };
  }, [markSeenNow, threadId, userId]);

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (!threadId) return;
      if (lastTypingSent.current === isTyping) return;
      lastTypingSent.current = isTyping;
      emitChatTyping(Number(threadId), isTyping);
    },
    [threadId],
  );

  const onComposerTypingChange = useCallback(
    (hasText: boolean) => {
      if (typingStopTimer.current) clearTimeout(typingStopTimer.current);

      if (hasText) {
        notifyTyping(true);
        typingStopTimer.current = setTimeout(() => notifyTyping(false), TYPING_STOP_MS);
        return;
      }

      notifyTyping(false);
    },
    [notifyTyping],
  );

  const stopTyping = useCallback(() => {
    if (typingStopTimer.current) clearTimeout(typingStopTimer.current);
    notifyTyping(false);
  }, [notifyTyping]);

  return { peerTyping, onComposerTypingChange, stopTyping, markSeenNow };
}

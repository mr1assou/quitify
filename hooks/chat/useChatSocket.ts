import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import {
  connectChatSocket,
  disconnectChatSocket,
  subscribeChatSocket,
} from "@/services/realtime/chatSocket";
import { mapBackendMessage } from "@/utils/chat/mapBackendChat";
import { getAccessToken } from "@/utils/auth/authStorage";

/** Keeps the chat WebSocket alive while the user is signed in. */
export function useChatSocket() {
  const { isHydrated, state } = useApp();
  const {
    loadChatThreads,
    receiveChatMessage,
    applyChatMessageUpdate,
    setMessagesSeen,
    flushChatOutbox,
  } = useCommunity();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const signedIn = isHydrated && Boolean(state.account);
  const userId = state.account?.userId ?? null;

  useEffect(() => {
    if (!signedIn || !userId) {
      disconnectChatSocket();
      return;
    }

    let cancelled = false;
    let unsubscribe: () => void = () => undefined;

    const connect = async () => {
      const token = await getAccessToken();
      if (!token || cancelled) return;

      unsubscribe = subscribeChatSocket({
        // Runs on the first connect and after every reconnect (network blip,
        // server restart/cold start): pulls threads + last messages from the
        // API so anything missed while the socket was down still shows up.
        onConnected: () => {
          void loadChatThreads();
          // Anything written on the device while offline goes out now.
          void flushChatOutbox();
        },
        onMessage: (payload) => {
          if (payload.sender_id === userId) return;
          receiveChatMessage(mapBackendMessage(payload, userId));
        },
        onMessageUpdated: (payload) => {
          applyChatMessageUpdate(mapBackendMessage(payload, userId));
        },
        onMessageDeleted: (payload) => {
          applyChatMessageUpdate(mapBackendMessage(payload, userId));
        },
        onMessagesSeen: (payload) => {
          setMessagesSeen(
            String(payload.thread_id),
            Date.parse(payload.last_read_at),
            payload.reader_user_id,
          );
        },
      });

      connectChatSocket(token);
      await loadChatThreads();
      void flushChatOutbox();
    };

    void connect();

    return () => {
      cancelled = true;
      unsubscribe();
      disconnectChatSocket();
    };
  }, [
    applyChatMessageUpdate,
    flushChatOutbox,
    loadChatThreads,
    receiveChatMessage,
    setMessagesSeen,
    signedIn,
    userId,
  ]);

  useEffect(() => {
    if (!signedIn || !userId) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      appState.current = nextState;

      if (nextState !== "active") return;

      void (async () => {
        const token = await getAccessToken();
        if (!token) return;
        connectChatSocket(token);
        await loadChatThreads();
        void flushChatOutbox();
      })();
    });

    return () => subscription.remove();
  }, [flushChatOutbox, loadChatThreads, signedIn, userId]);
}

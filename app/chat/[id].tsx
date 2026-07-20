import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { ChatHeader } from "@/components/feature/chat/ChatHeader";
import { ChatEmptyGreeting } from "@/components/feature/chat/ChatEmptyGreeting";
import {
  ChatMessageModals,
  type ChatMessageModalState,
} from "@/components/feature/chat/ChatMessageModals";
import { ChatTypingIndicator } from "@/components/feature/chat/ChatTypingIndicator";
import { MessageBubble } from "@/components/feature/chat/MessageBubble";
import { MessageComposer, type MessageComposerEditState } from "@/components/feature/chat/MessageComposer";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useChatThread } from "@/hooks/chat/useChat";
import { useChatThreadRealtime } from "@/hooks/chat/useChatThreadRealtime";
import { useProactiveChatGate } from "@/hooks/premium/useProactiveChatGate";
import { useUserTimezone } from "@/hooks/shared/useUserTimezone";
import type { ChatMessage } from "@/types/chat/chat";
import {
  addChatSocketListener,
  joinChatThread,
  leaveChatThread,
} from "@/services/realtime/chatSocket";
import { resolveOutgoingReadStatus } from "@/utils/chat/resolveOutgoingReadStatus";
import {
  canShowChatMessageActions,
} from "@/utils/chat/chatMessageMutation";
import { safeRouter } from "@/utils/app/safeRouter";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Row = {
  message: ChatMessage;
  fromMe: boolean;
  showTimestamp: boolean;
  readStatus?: "seen" | "unseen";
};

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threadId = typeof id === "string" ? id : "";
  const detail = useChatThread(threadId);
  const { colors } = useTheme();
  const timeZone = useUserTimezone();
  const {
    state,
    sendMessage,
    sendMediaMessages,
    loadChatMessages,
    loadMoreChatMessages,
    loadChatThreads,
    editChatMessage,
    deleteChatMessage,
  } = useCommunity();
  const { requireSendAccess } = useProactiveChatGate(
    detail?.participant,
    detail?.messages ?? [],
  );
  const { peerTyping, onComposerTypingChange, stopTyping, markSeenNow } =
    useChatThreadRealtime(threadId);
  const listRef = useRef<FlatList<Row>>(null);
  const [hydrating, setHydrating] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [editingMessage, setEditingMessage] = useState<MessageComposerEditState | null>(null);
  const [messageModal, setMessageModal] = useState<ChatMessageModalState | null>(null);
  const loadingMoreRef = useRef(false);
  const messagesLoadedForRef = useRef<string | null>(null);

  const hasThread = state.threads.some((thread) => thread.id === threadId);
  const threadMeta = state.threads.find((thread) => thread.id === threadId);
  const hasMore = threadMeta?.hasMoreMessages ?? false;

  useEffect(() => {
    if (!threadId) return;

    if (!hasThread) {
      setHydrating(true);
      void loadChatThreads().finally(() => setHydrating(false));
      return;
    }

    if (messagesLoadedForRef.current === threadId) return;
    messagesLoadedForRef.current = threadId;

    setMessagesLoading(true);
    void loadChatMessages(threadId).finally(() => setMessagesLoading(false));
  }, [threadId, hasThread, loadChatMessages, loadChatThreads]);

  useEffect(() => {
    if (!threadId || !hasThread || !detail) return;

    joinChatThread(Number(threadId));

    // After a reconnect (network blip, server restart) the server-side room
    // membership is gone and messages sent meanwhile were never pushed —
    // re-join the room and reload this thread from the API.
    const unsubscribeReconnect = addChatSocketListener("onConnected", () => {
      joinChatThread(Number(threadId));
      void loadChatMessages(threadId);
    });

    return () => {
      unsubscribeReconnect();
      leaveChatThread(Number(threadId));
    };
  }, [threadId, hasThread, detail, loadChatMessages]);

  useEffect(() => {
    if (!detail?.threadId || messagesLoading) return;
    markSeenNow();
  }, [detail?.threadId, messagesLoading, markSeenNow]);

  const rows = useMemo<Row[]>(() => {
    if (!detail) return [];
    const FIVE_MIN = 5 * 60 * 1000;
    const built = detail.messages.map((message, i) => {
      const next = detail.messages[i + 1];
      const showTimestamp =
        !next ||
        next.senderId !== message.senderId ||
        next.createdAt - message.createdAt > FIVE_MIN;
      return {
        message,
        fromMe: message.senderId === "me",
        showTimestamp,
        readStatus:
          message.senderId === "me"
            ? resolveOutgoingReadStatus(message, detail.peerLastReadAt)
            : undefined,
      };
    });
    return built.reverse();
  }, [detail]);

  const loadOlder = useCallback(async () => {
    if (!threadId || !hasMore || loadingMoreRef.current || messagesLoading) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      await loadMoreChatMessages(threadId);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, loadMoreChatMessages, messagesLoading, threadId]);

  const showNotFound = !hasThread && !hydrating && !messagesLoading;
  const showMessagesLoader = messagesLoading || hydrating;

  const onSend = (text: string) => {
    if (!detail) return;
    if (!requireSendAccess()) return;
    stopTyping();
    void sendMessage(detail.participant.id, text, detail.threadId);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const openMessageActions = useCallback((message: ChatMessage) => {
    if (!canShowChatMessageActions(message)) return;
    setMessageModal({ type: "options", message });
  }, []);

  const closeMessageModal = useCallback(() => {
    setMessageModal(null);
  }, []);

  const handleEditMessage = useCallback((message: ChatMessage) => {
    setMessageModal(null);
    setEditingMessage({
      messageId: message.id,
      initialText: message.text,
    });
  }, []);

  const handleDeleteMessage = useCallback(
    (message: ChatMessage) => {
      setMessageModal(null);
      void deleteChatMessage(threadId, message.id).then((ok) => {
        if (!ok) {
          setMessageModal({
            type: "error",
            title: "Could not delete message",
            message: "This message may no longer be deletable.",
          });
        }
      });
    },
    [deleteChatMessage, threadId],
  );

  const onSaveEdit = async (messageId: string, text: string) => {
    const ok = await editChatMessage(threadId, messageId, text);
    if (!ok) {
      setMessageModal({
        type: "error",
        title: "Could not edit message",
        message: "This message may no longer be editable.",
      });
      return;
    }
    setEditingMessage(null);
  };

  const onSendMedia = async (items: Parameters<typeof sendMediaMessages>[1]) => {
    if (!detail) return;
    if (!requireSendAccess()) return;
    stopTyping();
    setSendingMedia(true);
    try {
      await sendMediaMessages(detail.participant.id, items, detail.threadId);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    } finally {
      setSendingMedia(false);
    }
  };

  const firstName = detail
    ? detail.participant.name.trim().split(/\s+/)[0] || detail.participant.name
    : "";

  if (showNotFound) {
    return (
      <ScreenCanvas>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            Conversation not found.
          </Text>
        </View>
      </ScreenCanvas>
    );
  }

  return (
    <ScreenCanvas edges={["top"]}>
      {detail ? (
        <ChatHeader
          participant={detail.participant}
          isTyping={peerTyping}
        />
      ) : (
        <ChatHeaderPlaceholder />
      )}

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {showMessagesLoader ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-muted-foreground dark:text-d-muted">
                Loading messages…
              </Text>
            </View>
          ) : (
            <Animated.View entering={FadeInDown.duration(360)} style={{ flex: 1, backgroundColor: "transparent" }}>
              {rows.length === 0 && detail ? (
                <View className="absolute left-0 right-0 top-4 z-10" pointerEvents="none">
                  <ChatEmptyGreeting participantName={detail.participant.name} />
                </View>
              ) : null}

              <FlatList
                ref={listRef}
                inverted
                style={{ flex: 1, backgroundColor: "transparent" }}
                data={rows}
                extraData={rows.length}
                removeClippedSubviews={false}
                keyExtractor={(r) => r.message.id}
                contentContainerStyle={{
                  padding: 16,
                  paddingBottom: 8,
                  flexGrow: rows.length ? 0 : 1,
                }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <MessageBubble
                    message={item.message}
                    fromMe={item.fromMe}
                    showTimestamp={item.showTimestamp}
                    readStatus={item.readStatus}
                    timeZone={timeZone}
                    showActions={item.fromMe && canShowChatMessageActions(item.message)}
                    onPressActions={() => openMessageActions(item.message)}
                  />
                )}
                onEndReached={() => void loadOlder()}
                onEndReachedThreshold={0.2}
                ListFooterComponent={
                  loadingMore ? (
                    <View className="items-center py-3">
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
                        Loading earlier messages…
                      </Text>
                    </View>
                  ) : null
                }
              />
            </Animated.View>
          )}
        </View>

        {detail && peerTyping ? <ChatTypingIndicator label={`${firstName} is typing`} /> : null}

        <MessageComposer
          onSend={onSend}
          onTypingChange={onComposerTypingChange}
          onSendMedia={onSendMedia}
          isSendingMedia={sendingMedia}
          disabled={!detail}
          editState={editingMessage}
          onSaveEdit={onSaveEdit}
          onCancelEdit={() => setEditingMessage(null)}
        />
      </KeyboardAvoidingView>

      <ChatMessageModals
        state={messageModal}
        onClose={closeMessageModal}
        onEdit={handleEditMessage}
        onDelete={handleDeleteMessage}
      />
    </ScreenCanvas>
  );
}

function ChatHeaderPlaceholder() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center border-b border-section py-3 pl-1 pr-4 dark:border-d-border">
      <Pressable
        hitSlop={10}
        onPress={() => safeRouter.backOr("/chats")}
        className="mr-0.5 w-7 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={20} color={colors.foreground} />
      </Pressable>
      <View className="ml-2 h-10 w-10 rounded-full bg-section dark:bg-d-surface" />
      <View className="ml-2.5 gap-1.5">
        <View className="h-3.5 w-28 rounded bg-section dark:bg-d-surface" />
        <View className="h-3 w-20 rounded bg-section dark:bg-d-surface" />
      </View>
    </View>
  );
}

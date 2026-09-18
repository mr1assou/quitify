import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardGestureArea } from "react-native-keyboard-controller";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ChatKeyboardShell } from "@/components/feature/chat/ChatKeyboardShell";

import { ChatDaySeparator } from "@/components/feature/chat/ChatDaySeparator";
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
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useProactiveChatGate } from "@/hooks/premium/useProactiveChatGate";
import { useUserTimezone } from "@/hooks/shared/useUserTimezone";
import type { ChatMessage } from "@/types/chat/chat";
import {
  addChatSocketListener,
  joinChatThread,
  leaveChatThread,
} from "@/services/realtime/chatSocket";
import {
  calendarDayKeyInTimezone,
  formatChatDaySeparator,
} from "@/utils/chat/formatMessageTime";
import { resolveOutgoingReadStatus } from "@/utils/chat/resolveOutgoingReadStatus";
import {
  canShowChatMessageActions,
} from "@/utils/chat/chatMessageMutation";
import { safeRouter } from "@/utils/app/safeRouter";


type MessageRow = {
  kind: "message";
  key: string;
  message: ChatMessage;
  fromMe: boolean;
  showTimestamp: boolean;
  readStatus?: "seen" | "unseen";
};

type DayRow = {
  kind: "day";
  key: string;
  label: string;
};

type Row = MessageRow | DayRow;

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const threadId = typeof id === "string" ? id : "";
  const detail = useChatThread(threadId);
  const { colors } = useTheme();
  const { t, locale } = useTranslation();
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
    const chronological: Row[] = [];

    for (let i = 0; i < detail.messages.length; i++) {
      const message = detail.messages[i];
      const prev = detail.messages[i - 1];
      const next = detail.messages[i + 1];
      const dayKey = calendarDayKeyInTimezone(message.createdAt, timeZone);
      const prevDayKey = prev
        ? calendarDayKeyInTimezone(prev.createdAt, timeZone)
        : null;

      if (dayKey !== prevDayKey) {
        chronological.push({
          kind: "day",
          key: `day-${dayKey}`,
          label: formatChatDaySeparator(message.createdAt, timeZone, locale),
        });
      }

      const showTimestamp =
        !next ||
        next.senderId !== message.senderId ||
        next.createdAt - message.createdAt > FIVE_MIN ||
        dayKey !== calendarDayKeyInTimezone(next.createdAt, timeZone);

      chronological.push({
        kind: "message",
        key: message.clientKey ?? message.id,
        message,
        fromMe: message.senderId === "me",
        showTimestamp,
        readStatus:
          message.senderId === "me"
            ? resolveOutgoingReadStatus(message, detail.peerLastReadAt)
            : undefined,
      });
    }

    // Inverted FlatList: reverse so newest sits at the bottom with day headers above each block.
    return chronological.reverse();
  }, [detail, locale, timeZone]);

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
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
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
            title: t("chat.deleteMessageFailed"),
            message: t("chat.deleteMessageNotDeletable"),
          });
        }
      });
    },
    [deleteChatMessage, threadId, t],
  );

  const onSaveEdit = async (messageId: string, text: string) => {
    const ok = await editChatMessage(threadId, messageId, text);
    if (!ok) {
      setMessageModal({
        type: "error",
        title: t("chat.editMessageFailed"),
        message: t("chat.editMessageNotEditable"),
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
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    } finally {
      setSendingMedia(false);
    }
  };

  const firstName = detail
    ? detail.participant.name.trim().split(/\s+/)[0] || detail.participant.name
    : "";

  const keyExtractor = useCallback((row: Row) => row.key, []);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => {
      if (item.kind === "day") {
        return <ChatDaySeparator label={item.label} />;
      }

      return (
        <MessageBubble
          message={item.message}
          fromMe={item.fromMe}
          showTimestamp={item.showTimestamp}
          readStatus={item.readStatus}
          timeZone={timeZone}
          showActions={item.fromMe && canShowChatMessageActions(item.message)}
          onPressActions={openMessageActions}
        />
      );
    },
    [openMessageActions, timeZone],
  );

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

      <ChatKeyboardShell>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          {showMessagesLoader ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-muted-foreground dark:text-d-muted">
                Loading messages…
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, backgroundColor: "transparent" }}>
              {rows.length === 0 && detail ? (
                <View className="absolute left-0 right-0 top-4 z-10" pointerEvents="none">
                  <ChatEmptyGreeting participantName={detail.participant.name} />
                </View>
              ) : null}

              <KeyboardGestureArea
                style={{ flex: 1 }}
                interpolator="ios"
                textInputNativeID="chat-composer-input"
              >
                <FlatList
                  ref={listRef}
                  inverted
                  style={{ flex: 1, backgroundColor: "transparent" }}
                  data={rows}
                  keyExtractor={keyExtractor}
                  renderItem={renderItem}
                  windowSize={11}
                  maxToRenderPerBatch={8}
                  updateCellsBatchingPeriod={50}
                  initialNumToRender={16}
                  contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 8,
                    flexGrow: rows.length ? 0 : 1,
                  }}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="none"
                  automaticallyAdjustKeyboardInsets={false}
                  automaticallyAdjustContentInsets={false}
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
              </KeyboardGestureArea>
            </View>
          )}
        </View>

        {detail && peerTyping ? (
          <ChatTypingIndicator label={`${firstName} is typing`} />
        ) : null}

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
      </ChatKeyboardShell>

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

import { router, useLocalSearchParams } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatHeader } from "@/components/feature/chat/ChatHeader";
import { ChatEmptyGreeting } from "@/components/feature/chat/ChatEmptyGreeting";
import { ChatTypingIndicator } from "@/components/feature/chat/ChatTypingIndicator";
import { MessageBubble } from "@/components/feature/chat/MessageBubble";
import { MessageComposer } from "@/components/feature/chat/MessageComposer";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import { useChatThread } from "@/hooks/useChat";
import { useChatThreadRealtime } from "@/hooks/useChatThreadRealtime";
import { useUserTimezone } from "@/hooks/useUserTimezone";
import type { CallKind, ChatMessage } from "@/types/chat";
import { joinChatThread, leaveChatThread } from "@/services/realtime/chatSocket";
import { resolveOutgoingReadStatus } from "@/utils/chat/resolveOutgoingReadStatus";
import { safeRouter } from "@/utils/safeRouter";

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
  } = useCommunity();
  const { peerTyping, onComposerTypingChange, stopTyping, markSeenNow } =
    useChatThreadRealtime(threadId);
  const listRef = useRef<FlatList<Row>>(null);
  const [hydrating, setHydrating] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sendingMedia, setSendingMedia] = useState(false);
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
    return () => leaveChatThread(Number(threadId));
  }, [threadId, hasThread, detail]);

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

  if (showNotFound) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            Conversation not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onCall = (kind: CallKind) => {
    if (!detail) return;
    router.push({
      pathname: "/call-by-user/[id]",
      params: { id: detail.participant.id, kind },
    });
  };

  const onSend = (text: string) => {
    if (!detail) return;
    stopTyping();
    void sendMessage(detail.participant.id, text, detail.threadId);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onSendMedia = async (items: Parameters<typeof sendMediaMessages>[1]) => {
    if (!detail) return;
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

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      {detail ? (
        <ChatHeader participant={detail.participant} onCall={onCall} isTyping={peerTyping} />
      ) : (
        <ChatHeaderPlaceholder />
      )}

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {showMessagesLoader ? (
            <View className="flex-1 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-sm text-muted-foreground dark:text-d-muted">
                Loading messages…
              </Text>
            </View>
          ) : (
            <Animated.View entering={FadeInDown.duration(360)} style={{ flex: 1 }}>
              {rows.length === 0 && detail ? (
                <View className="absolute left-0 right-0 top-4 z-10" pointerEvents="none">
                  <ChatEmptyGreeting participantName={detail.participant.name} />
                </View>
              ) : null}

              <FlatList
                ref={listRef}
                inverted
                style={{ flex: 1 }}
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
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
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

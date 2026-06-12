import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatHeader } from "@/components/feature/chat/ChatHeader";
import { MessageBubble } from "@/components/feature/chat/MessageBubble";
import { MessageComposer } from "@/components/feature/chat/MessageComposer";
import { useCommunity } from "@/context/CommunityContext";
import { useChatThread } from "@/hooks/useChat";
import type { CallKind, ChatMessage } from "@/types/chat";

type Row = { message: ChatMessage; fromMe: boolean; showTimestamp: boolean };

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useChatThread(id ?? "");
  const { sendMessage, markThreadRead } = useCommunity();
  const listRef = useRef<FlatList<Row>>(null);

  useEffect(() => {
    if (detail?.threadId) markThreadRead(detail.threadId);
  }, [detail?.threadId, markThreadRead]);

  const rows = useMemo<Row[]>(() => {
    if (!detail) return [];
    const FIVE_MIN = 5 * 60 * 1000;
    return detail.messages.map((message, i) => {
      const next = detail.messages[i + 1];
      const showTimestamp =
        !next ||
        next.senderId !== message.senderId ||
        next.createdAt - message.createdAt > FIVE_MIN;
      return {
        message,
        fromMe: message.senderId === "me",
        showTimestamp,
      };
    });
  }, [detail]);

  if (!detail) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg">
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-muted-foreground dark:text-d-muted">
            Conversation not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onCall = (kind: CallKind) =>
    router.push({
      pathname: "/call-by-user/[id]",
      params: { id: detail.participant.id, kind },
    });

  const onSend = (text: string) => {
    sendMessage(detail.participant.id, text);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ChatHeader participant={detail.participant} onCall={onCall} />

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={rows}
          keyExtractor={(r) => r.message.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <MessageBubble
              message={item.message}
              fromMe={item.fromMe}
              showTimestamp={item.showTimestamp}
            />
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View className="mt-12 items-center">
              <Text className="text-base font-semibold text-foreground dark:text-d-text">
                Say hi to {detail.participant.name}
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
                Be kind. We're all quitting together.
              </Text>
            </View>
          }
        />

        <MessageComposer
          onSend={onSend}
          onSendMedia={(items) => {
            const summary = items
              .map((item) => (item.kind === "video" ? "🎥 Video" : "📷 Photo"))
              .join(" ");
            sendMessage(detail.participant.id, summary);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

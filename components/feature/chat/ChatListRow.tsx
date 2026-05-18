import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { UserAvatar } from "@/components/feature/community/UserAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { ChatThreadPreview } from "@/hooks/useChat";
import { formatChatRelativeDate } from "@/utils/community";

type Props = {
  preview: ChatThreadPreview;
};

export function ChatListRow({ preview }: Props) {
  const { colors } = useTheme();
  const { participant, lastMessage, unreadCount, threadId } = preview;

  const lastText = lastMessage?.text ?? "Say hi 👋";
  const lastFromMe = lastMessage?.senderId === "me";

  return (
    <Pressable
      onPress={() => router.push(`/chat/${threadId}`)}
      className="flex-row items-center px-6 py-3"
      android_ripple={{ color: colors.section }}
    >
      <UserAvatar user={participant} size={52} />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="flex-1 text-base font-bold text-foreground dark:text-d-text">
            {participant.name}
          </Text>
          {lastMessage ? (
            <Text className="text-xs text-muted-foreground dark:text-d-muted">
              {formatChatRelativeDate(lastMessage.createdAt)}
            </Text>
          ) : null}
        </View>
        <View className="mt-1 flex-row items-center">
          <Text
            numberOfLines={1}
            className="flex-1 text-sm text-muted-foreground dark:text-d-muted"
            style={unreadCount > 0 ? { color: colors.foreground, fontWeight: "600" } : undefined}
          >
            {lastFromMe ? "You: " : ""}{lastText}
          </Text>
          {unreadCount > 0 ? (
            <View
              className="ml-2 min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-xs font-bold text-white">{unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { MessageReadTicks } from "@/components/feature/chat/MessageReadTicks";
import {
  isSupportStaffUser,
  SUPPORT_STAFF_SUBTITLE,
} from "@/constants/auth/userRoles";
import { useTheme } from "@/context/ThemeContext";
import type { ChatThreadPreview } from "@/hooks/chat/useChat";
import { useChatParticipantPresence } from "@/hooks/chat/useChatParticipantPresence";
import { useUserTimezone } from "@/hooks/shared/useUserTimezone";
import { getBadgeName } from "@/utils/progress/badges";
import { formatMessageListTime } from "@/utils/chat/formatMessageTime";
import { formatChatMessagePreview } from "@/utils/chat/chatMessageMutation";

type Props = {
  preview: ChatThreadPreview;
};

export function ChatListRow({ preview }: Props) {
  const { colors } = useTheme();
  const { participant, lastMessage, unreadCount, threadId, lastOutgoingReadStatus } = preview;
  const { isOnline } = useChatParticipantPresence(participant);
  const timeZone = useUserTimezone();
  const badgeName = getBadgeName(participant.badgeId);
  const avatarRank = participant.leaderboardRank || participant.avatarRank || 1;
  const isSupportPeer = isSupportStaffUser(participant);

  const lastText = lastMessage ? formatChatMessagePreview(lastMessage) : "Say hi 👋";
  const lastFromMe = lastMessage?.senderId === "me";

  return (
    <Pressable
      onPress={() => router.push(`/chat/${threadId}`)}
      className="flex-row items-center px-6 py-3"
      android_ripple={{ color: colors.section }}
    >
      <LeaderboardAvatar
        name={participant.name}
        isCurrentUser={!!participant.isCurrentUser}
        rank={avatarRank}
        countryFlag={participant.countryFlag}
        imageUrl={participant.avatarUrl}
        size={52}
        isOnline={isOnline}
      />

      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="flex-1 text-base font-bold text-foreground dark:text-d-text">
            {participant.name}
          </Text>
          {lastMessage ? (
            <Text className="text-xs text-muted-foreground dark:text-d-muted">
              {formatMessageListTime(lastMessage.createdAt, timeZone)}
            </Text>
          ) : null}
        </View>

        <View className="mt-1 flex-row items-center gap-1.5">
          {isSupportPeer ? (
            <Text
              numberOfLines={1}
              className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
            >
              <Text className="text-muted-foreground dark:text-d-muted">
                {SUPPORT_STAFF_SUBTITLE}
                {" · "}
              </Text>
              <Text
                style={unreadCount > 0 ? { color: colors.foreground, fontWeight: "600" } : undefined}
              >
                {lastFromMe ? "You: " : ""}
                {lastText}
              </Text>
            </Text>
          ) : (
            <>
              <BadgeArt badgeId={participant.badgeId} size={18} />
              <Text
                numberOfLines={1}
                className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
              >
                {badgeName}
                {" · "}
                <Text
                  style={unreadCount > 0 ? { color: colors.foreground, fontWeight: "600" } : undefined}
                >
                  {lastFromMe ? "You: " : ""}
                  {lastText}
                </Text>
              </Text>
            </>
          )}
          {lastFromMe && lastOutgoingReadStatus ? (
            <MessageReadTicks status={lastOutgoingReadStatus} />
          ) : null}
          {unreadCount > 0 ? (
            <View
              className="ml-1 min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5"
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

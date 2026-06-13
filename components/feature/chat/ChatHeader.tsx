import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { ChatLastSeenSuffix } from "@/components/feature/chat/ChatLastSeenSuffix";
import { useTheme } from "@/context/ThemeContext";
import { useChatParticipantPresence } from "@/hooks/useChatParticipantPresence";
import type { CallKind } from "@/types/chat";
import type { CommunityUser } from "@/types/community";
import { getBadgeName } from "@/utils/badges";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";

const ONLINE_COLOR = "#22C55E";

type Props = {
  participant: CommunityUser;
  onCall: (kind: CallKind) => void;
};

/** Top bar for the chat thread screen — avatar, name, audio + video call. */
export function ChatHeader({ participant, onCall }: Props) {
  const { colors } = useTheme();
  const { isOnline, lastSeenAt } = useChatParticipantPresence(participant);
  const badgeName = getBadgeName(participant.badgeId);
  const avatarRank = participant.leaderboardRank || participant.avatarRank || 1;

  return (
    <View className="flex-row items-center border-b border-section py-3 pl-1 pr-4 dark:border-d-border">
      <Pressable
        hitSlop={10}
        onPress={() => router.back()}
        className="mr-0.5 w-7 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={20} color={colors.foreground} />
      </Pressable>

      <Pressable
        onPress={() => navigateToUserProfile(participant)}
        className="min-w-0 flex-1 flex-row items-center"
      >
        <LeaderboardAvatar
          name={participant.name}
          isCurrentUser={!!participant.isCurrentUser}
          rank={avatarRank}
          countryFlag={participant.countryFlag}
          size={40}
          isOnline={isOnline}
        />

        <View className="ml-2.5 min-w-0 flex-1">
          <View className="min-w-0 flex-row items-center">
            <Text
              className="shrink text-base font-bold text-foreground dark:text-d-text"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {participant.name}
            </Text>
            <ChatPresenceSuffix isOnline={isOnline} lastSeenAt={lastSeenAt} />
          </View>

          <View className="mt-0.5 flex-row items-center gap-1.5">
            <BadgeArt badgeId={participant.badgeId} size={18} />
            <Text
              className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {badgeName} 
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="flex-row items-center gap-2">
        <CallIconButton
          icon="call"
          color={colors.primary}
          onPress={() => onCall("audio")}
          accessibilityLabel="Start audio call"
        />
        <CallIconButton
          icon="videocam"
          color={colors.accent}
          onPress={() => onCall("video")}
          accessibilityLabel="Start video call"
        />
      </View>
    </View>
  );
}

function ChatPresenceSuffix({
  isOnline,
  lastSeenAt,
}: {
  isOnline: boolean;
  lastSeenAt?: number;
}) {
  if (isOnline) {
    return (
      <Text
        className="shrink-0 text-xs font-medium"
        style={{ color: ONLINE_COLOR }}
        numberOfLines={1}
      >
        {" "}
        · Online
      </Text>
    );
  }

  if (lastSeenAt) {
    return <ChatLastSeenSuffix lastSeenAt={lastSeenAt} />;
  }

  return null;
}

function CallIconButton({
  icon,
  color,
  onPress,
  accessibilityLabel,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityLabel={accessibilityLabel}
      className="h-10 w-10 items-center justify-center rounded-full"
      style={{ backgroundColor: `${color}20` }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

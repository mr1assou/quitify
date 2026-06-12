import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { CallKind } from "@/types/chat";
import type { CommunityUser } from "@/types/community";
import { getBadgeName } from "@/utils/badges";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";

type Props = {
  participant: CommunityUser;
  onCall: (kind: CallKind) => void;
};

/** Top bar for the chat thread screen — avatar, name, audio + video call. */
export function ChatHeader({ participant, onCall }: Props) {
  const { colors } = useTheme();
  const badgeName = getBadgeName(participant.badgeId);
  const avatarRank = participant.leaderboardRank || participant.avatarRank || 1;

  return (
    <View className="flex-row items-center border-b border-section px-4 py-3 dark:border-d-border">
      <Pressable hitSlop={8} onPress={() => router.back()} className="pr-2">
        <Ionicons name="chevron-back" size={26} color={colors.foreground} />
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
        />

        <View className="ml-3 min-w-0 flex-1">
          <Text
            className="text-base font-bold text-foreground dark:text-d-text"
            numberOfLines={1}
          >
            {participant.name}
          </Text>

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

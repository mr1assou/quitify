import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { ChatLastSeenSuffix } from "@/components/feature/chat/ChatLastSeenSuffix";
import {
  isSupportStaffUser,
  SUPPORT_STAFF_SUBTITLE,
} from "@/constants/auth/userRoles";
import { useTheme } from "@/context/ThemeContext";
import { useChatParticipantPresence } from "@/hooks/chat/useChatParticipantPresence";
import type { CommunityUser } from "@/types/community/community";
import { getBadgeName } from "@/utils/progress/badges";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";
import { safeRouter } from "@/utils/app/safeRouter";

const ONLINE_COLOR = "#22C55E";

type Props = {
  participant: CommunityUser;
  isTyping?: boolean;
};

/** Top bar for the chat thread screen — avatar, name, presence. */
export function ChatHeader({
  participant,
  isTyping = false,
}: Props) {
  const { colors } = useTheme();
  const { isOnline, lastSeenAt } = useChatParticipantPresence(participant);
  const badgeName = getBadgeName(participant.badgeId);
  const avatarRank = participant.leaderboardRank || participant.avatarRank || 1;
  const isSupportPeer = isSupportStaffUser(participant);

  const identity = (
    <>
      <LeaderboardAvatar
        name={participant.name}
        isCurrentUser={!!participant.isCurrentUser}
        rank={avatarRank}
        countryFlag={participant.countryFlag}
        imageUrl={participant.avatarUrl}
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

        <View className="mt-0.5 min-h-[16px] flex-row items-center gap-1.5">
          {isTyping ? (
            <Animated.Text
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(140)}
              className="text-xs font-medium text-primary"
            >
              typing…
            </Animated.Text>
          ) : isSupportPeer ? (
            <Animated.Text
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(140)}
              className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {SUPPORT_STAFF_SUBTITLE}
            </Animated.Text>
          ) : (
            <Animated.View
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(140)}
              className="min-w-0 flex-1 flex-row items-center gap-1.5"
            >
              <BadgeArt badgeId={participant.badgeId} size={18} />
              <Text
                className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
                numberOfLines={1}
              >
                {badgeName}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </>
  );

  return (
    <View className="flex-row items-center border-b border-section py-3 pl-1 pr-4 dark:border-d-border">
      <Pressable
        hitSlop={10}
        onPress={() => safeRouter.backOr("/chats")}
        className="mr-0.5 w-7 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={20} color={colors.foreground} />
      </Pressable>

      {isSupportPeer ? (
        <View className="min-w-0 flex-1 flex-row items-center">{identity}</View>
      ) : (
        <Pressable
          onPress={() => navigateToUserProfile(participant)}
          className="min-w-0 flex-1 flex-row items-center"
        >
          {identity}
        </Pressable>
      )}
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

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { useCommunity } from "@/context/CommunityContext";
import { useTheme } from "@/context/ThemeContext";
import {
  countryFlagForRank,
  resolveCountryFlagUrl,
} from "@/constants/leaderboard/leaderboardCountries";
import type { CommunityUser } from "@/types/community/community";
import { parseDbUserId, resolveOnlineFromMap } from "@/utils/community/presence";
import { getBadgeName } from "@/utils/progress/badges";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";

type Props = {
  user: CommunityUser;
};

export function SearchUserResultRow({ user }: Props) {
  const { colors } = useTheme();
  const { state: communityState } = useCommunity();
  const badgeName = getBadgeName(user.badgeId);
  const userId = parseDbUserId(user.id);

  const isOnlineResolved =
    (userId != null
      ? resolveOnlineFromMap(
          user.id,
          communityState.onlineByUserId,
          user.isOnline,
          communityState.presenceReady,
        )
      : user.isOnline) ?? false;

  const countryFlag =
    resolveCountryFlagUrl(user.countryFlag, user.countryCode) ??
    countryFlagForRank(user.avatarRank);

  const openProfile = () => navigateToUserProfile(user);
  const openChat = () => router.push(`/chat-by-user/${user.id}`);

  return (
    <Pressable
      onPress={openProfile}
      className="flex-row items-center rounded-2xl bg-elevated px-3 py-3 dark:bg-d-elevated"
    >
      <LeaderboardAvatar
        name={user.name}
        isCurrentUser={false}
        rank={user.avatarRank}
        countryFlag={countryFlag}
        imageUrl={user.avatarUrl}
        size={48}
        isOnline={isOnlineResolved}
      />

      <View className="ml-3 flex-1">
        <Text
          className="text-base font-bold text-foreground dark:text-d-text"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-2">
          <BadgeArt badgeId={user.badgeId} size={22} />
          <Text
            className="flex-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
            numberOfLines={1}
          >
            {badgeName}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={openChat}
        hitSlop={8}
        className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-primary"
        accessibilityLabel={`Message ${user.name}`}
      >
        <Ionicons name="chatbubble-ellipses" size={18} color={colors.white} />
      </Pressable>
    </Pressable>
  );
}

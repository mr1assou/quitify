import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { resolveCountryFlagUrl } from "@/constants/leaderboard/leaderboardCountries";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import { useProgress } from "@/hooks/progress/useProgress";
import type { CommunityUser } from "@/types/community/community";
import { getBadgeName, resolveHighestUnlockedBadgeId } from "@/utils/progress/badges";
import { formatRelativeTime } from "@/utils/community";
import { navigateToUserProfile } from "@/utils/profile/navigateToUserProfile";

type Props = {
  author: CommunityUser;
  createdAt: number;
  /** Show an overflow "…" button on the right. */
  onMore?: () => void;
};

export function PostHeader({ author, createdAt, onMore }: Props) {
  const { colors } = useTheme();
  const { state } = useApp();
  const { snapshot: leaderboard } = useLeaderboard();
  const progress = useProgress();

  const badgeId =
    author.isCurrentUser && progress
      ? (resolveHighestUnlockedBadgeId(progress.badges, state.isPremium) ?? author.badgeId)
      : author.badgeId;

  const badgeName = getBadgeName(badgeId);

  const avatarRank = useMemo(() => {
    if (author.isCurrentUser && leaderboard?.currentUser) return leaderboard.currentUser.rank;
    return author.leaderboardRank;
  }, [author.isCurrentUser, author.leaderboardRank, leaderboard]);

  const countryFlag = useMemo(() => {
    if (!author.isCurrentUser) return author.countryFlag;
    return (
      resolveCountryFlagUrl(state.profile?.countryFlag, state.profile?.countryCode) ??
      author.countryFlag
    );
  }, [author.countryFlag, author.isCurrentUser, state.profile?.countryCode, state.profile?.countryFlag]);

  const avatarUrl = useMemo(() => {
    if (author.isCurrentUser && state.profile?.imageUrl) return state.profile.imageUrl;
    return author.avatarUrl;
  }, [author.avatarUrl, author.isCurrentUser, state.profile?.imageUrl]);

  return (
    <View className="flex-row items-center">
      <Pressable
        hitSlop={6}
        onPress={() =>
          navigateToUserProfile(author, {
            currentUserRank: author.isCurrentUser ? avatarRank : undefined,
          })
        }
        className="min-w-0 flex-1 flex-row items-center"
      >
        <LeaderboardAvatar
          name={author.name}
          isCurrentUser={!!author.isCurrentUser}
          rank={avatarRank}
          countryFlag={countryFlag}
          imageUrl={avatarUrl}
          size={44}
          flagLeft={-8}
          isOnline={author.isOnline}
        />

        <View className="ml-3 min-w-0 flex-1">
          <View className="min-w-0 flex-row items-baseline">
            <Text
              className="shrink text-base font-bold text-foreground dark:text-d-text"
              numberOfLines={1}
            >
              {author.name}
            </Text>
            <Text className="ml-1.5 shrink-0 text-xs text-muted-foreground dark:text-d-muted">
              · {formatRelativeTime(createdAt)} 
            </Text>
          </View>

          <View className="mt-1 flex-row items-center gap-2">
            <BadgeArt badgeId={badgeId} size={22} />
            <Text
              className="min-w-0 flex-1 text-xs text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {badgeName}
            </Text>
          </View>
        </View>
      </Pressable>

      {onMore ? (
        <Pressable hitSlop={8} onPress={onMore} className="ml-2">
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { LeaderboardEntry } from "@/types/leaderboard/leaderboard";
import { getBadgeName } from "@/utils/progress/badges";
import { formatNumber } from "@/utils/shared/format";
import { navigateToSelfPlayerProfile } from "@/utils/profile/navigateToUserProfile";
import { safeRouter } from "@/utils/app/safeRouter";

type Props = {
  entry: LeaderboardEntry;
  showDivider?: boolean;
};

function RankLabel({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <View className="mr-2 w-7 items-center rounded-full bg-accent/12 py-0.5">
        <Text className="text-sm font-bold tabular-nums text-accent">{rank}</Text>
      </View>
    );
  }

  if (rank <= 3) {
    return (
      <View className="mr-2 w-7 items-center rounded-full bg-accent/15 py-0.5 dark:bg-primary/25">
        <Text className="text-xs font-bold tabular-nums text-primary dark:text-d-text">
          {rank}
        </Text>
      </View>
    );
  }

  return (
    <Text className="mr-2 w-7 text-center text-xs font-semibold tabular-nums text-muted-foreground dark:text-d-muted">
      {rank}
    </Text>
  );
}

export function LeaderboardRow({ entry, showDivider }: Props) {
  const { colors } = useTheme();
  const badgeName = getBadgeName(entry.badgeId);

  const openProfile = () => {
    if (entry.isCurrentUser) {
      navigateToSelfPlayerProfile();
      return;
    }
    safeRouter.push(`/player/${entry.rank}`);
  };

  return (
    <View>
      {showDivider ? (
        <View className="ml-28 h-px bg-border/40 dark:bg-d-border" />
      ) : null}
      <Pressable
        onPress={openProfile}
        className="flex-row items-center px-3 py-3 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={`View ${entry.name}'s profile`}
      >
        <RankLabel rank={entry.rank} />

        <LeaderboardAvatar
          name={entry.name}
          isCurrentUser={entry.isCurrentUser}
          rank={entry.rank}
          countryFlag={entry.countryFlag}
          imageUrl={entry.imageUrl}
          isOnline={entry.isOnline}
        />

        <View className="ml-3 min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="flex-shrink text-base font-semibold text-foreground dark:text-d-text"
              numberOfLines={1}
            >
              {entry.name}
            </Text>
            {entry.isCurrentUser ? (
              <View className="rounded-full bg-accent px-2 py-0.5">
                <Text className="text-[10px] font-bold uppercase text-white">You</Text>
              </View>
            ) : null}
          </View>
          <View className="mt-1.5 flex-row items-center gap-2">
            <BadgeArt badgeId={entry.badgeId} size={28} />
            <Text
              className="flex-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {badgeName}
            </Text>
          </View>
        </View>

        <View className="items-end pl-2">
          <View className="flex-row items-center gap-1.5">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
              <Ionicons name="flash" size={12} color={colors.white} />
            </View>
            <Text className="text-sm font-bold tabular-nums text-foreground dark:text-d-text">
              {formatNumber(entry.xp)}
            </Text>
          </View>
          <Text className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-d-muted">
            FP
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

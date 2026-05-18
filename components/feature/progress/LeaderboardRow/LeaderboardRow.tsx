import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { LeaderboardAvatar } from "@/components/feature/progress/LeaderboardAvatar";
import { useTheme } from "@/context/ThemeContext";
import type { LeaderboardEntry } from "@/types/leaderboard";
import { getBadgeName } from "@/utils/badges";
import { formatNumber } from "@/utils/format";

type Props = {
  entry: LeaderboardEntry;
  showDivider?: boolean;
  /** Pinned “you” row at the top of the leaderboard. */
  pinned?: boolean;
  totalUsers?: number;
};

function rankTone(rank: number): string {
  if (rank === 1) return "text-accent";
  if (rank === 2) return "text-foreground dark:text-d-text";
  if (rank === 3) return "text-foreground dark:text-d-text";
  return "text-muted-foreground dark:text-d-muted";
}

/** Full rank with grouping (e.g. 100,000) — not abbreviated like FP totals. */
function formatRank(rank: number): string {
  return rank.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function LeaderboardRow({ entry, showDivider, pinned, totalUsers }: Props) {
  const { colors } = useTheme();
  const isTopThree = !pinned && entry.rank <= 3;
  const badgeName = getBadgeName(entry.badgeId);
  const badgeArtSize = pinned ? 32 : 28;

  return (
    <View>
      {showDivider ? (
        <View className="ml-[68px] h-px bg-background dark:bg-d-border" />
      ) : null}
      <View
        className={`flex-row items-center px-3 ${
          pinned ? "py-4" : "py-3"
        } ${entry.isCurrentUser ? "rounded-2xl bg-accent/15 dark:bg-accent/20" : ""}`}
      >
        <View className={pinned ? "min-w-[76px] shrink-0 items-center justify-center" : "w-9 items-center"}>
          {pinned ? (
            <Text
              className="text-sm font-bold tabular-nums text-accent"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              #{formatRank(entry.rank)}
            </Text>
          ) : isTopThree ? (
            <Ionicons
              name={entry.rank === 1 ? "trophy" : "medal"}
              size={entry.rank === 1 ? 20 : 18}
              color={entry.rank === 1 ? colors.accent : colors.mutedForeground}
            />
          ) : (
            <Text className={`text-sm font-bold tabular-nums ${rankTone(entry.rank)}`}>
              {entry.rank}
            </Text>
          )}
        </View>

        <LeaderboardAvatar name={entry.name} isCurrentUser={entry.isCurrentUser} />

        <View className="ml-3 min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`flex-shrink text-base font-semibold ${
                entry.isCurrentUser
                  ? "text-foreground dark:text-d-text"
                  : "text-foreground dark:text-d-text"
              }`}
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
            <BadgeArt badgeId={entry.badgeId} size={badgeArtSize} />
            <Text
              className="flex-1 text-xs font-semibold text-muted-foreground dark:text-d-muted"
              numberOfLines={1}
            >
              {badgeName}
            </Text>
          </View>
          {pinned && totalUsers ? (
            <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
              {formatNumber(totalUsers)} people on the journey
            </Text>
          ) : null}
        </View>

        <View className="items-end pl-2">
          <Text className="text-sm font-bold tabular-nums text-foreground dark:text-d-text">
            {formatNumber(entry.xp)}
          </Text>
          <Text className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-d-muted">
            FP
          </Text>
        </View>
      </View>
    </View>
  );
}

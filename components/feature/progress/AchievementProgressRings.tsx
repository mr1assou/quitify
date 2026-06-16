import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTheme } from "@/context/ThemeContext";
import type { GlobalRank } from "@/types/progress";
import type { AchievementBadgeMetric } from "@/utils/achievementProgress";
import { progressToPercent } from "@/utils/achievementProgress";
import { formatNumber } from "@/utils/format";

const RING = { size: 156, stroke: 10 } as const;
const RING_BADGE_SIZE = 96;

type Props = {
  badge: AchievementBadgeMetric;
  freedomPoints: number;
  currentBadgeId: string;
  rank: GlobalRank;
};

export function AchievementProgressRings({
  badge,
  freedomPoints,
  currentBadgeId,
  rank,
}: Props) {
  const { colors } = useTheme();
  const pct = progressToPercent(badge.progress);
  const hasEarnedBadge = badge.caption !== "—";

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="trophy" size={18} color={colors.white} />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Your progress
            </Text>
          </View>
        </View>

        <View className="mt-4 items-center">
        <ProgressRing
          progress={badge.progress}
          size={RING.size}
          strokeWidth={RING.stroke}
          color={colors.primary}
          trackColor={colors.border}
        >
          {hasEarnedBadge ? (
            <BadgeArt badgeId={currentBadgeId} size={RING_BADGE_SIZE} />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-section dark:bg-d-surface">
              <Ionicons name="ribbon-outline" size={40} color={colors.mutedForeground} />
            </View>
          )}
        </ProgressRing>

        <Text className="mt-2 text-xl font-bold tabular-nums text-foreground dark:text-d-text">
          {pct}%
        </Text>

        <Text className="mt-2 text-center text-sm font-semibold text-foreground dark:text-d-text">
          {badge.label}
        </Text>
        <Text className="mt-0.5 text-center text-xs text-muted-foreground dark:text-d-muted">
          {badge.caption}
        </Text>

        <View className="mt-5 w-full flex-row border-t border-background pt-5 dark:border-d-border">
          <View className="flex-1 items-center border-r border-background pr-3 dark:border-d-border">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Worldwide rank
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-accent">
                <Ionicons name="globe" size={16} color={colors.white} />
              </View>
              <Text className="text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
                #{formatNumber(rank.position)}
              </Text>
            </View>
            <Text className="mt-1 text-center text-xs text-muted-foreground dark:text-d-muted">
              among {formatNumber(rank.total)} people
            </Text>
          </View>

          <View className="flex-1 items-center pl-3">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Freedom points
            </Text>
            <View className="mt-2 flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Ionicons name="flash" size={16} color={colors.white} />
              </View>
              <Text className="text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
                {formatNumber(freedomPoints)}
              </Text>
            </View>
          </View>
        </View>
        </View>
      </Card>
    </Animated.View>
  );
}

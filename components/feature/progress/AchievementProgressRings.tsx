import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTheme } from "@/context/ThemeContext";
import type { AchievementBadgeMetric } from "@/utils/achievementProgress";
import { progressToPercent } from "@/utils/achievementProgress";
import { formatNumber } from "@/utils/format";

const RING = { size: 156, stroke: 10 } as const;
const RING_BADGE_SIZE = 96;

type Props = {
  badge: AchievementBadgeMetric;
  freedomPoints: number;
  currentBadgeId: string;
};

export function AchievementProgressRings({ badge, freedomPoints, currentBadgeId }: Props) {
  const { colors } = useTheme();
  const pct = progressToPercent(badge.progress);

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section" className="items-center">
        <ProgressRing
          progress={badge.progress}
          size={RING.size}
          strokeWidth={RING.stroke}
          color={colors.primary}
          trackColor={colors.border}
        >
          <BadgeArt badgeId={currentBadgeId} size={RING_BADGE_SIZE} />
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

        <View className="mt-5 w-full items-center border-t border-background pt-5 dark:border-d-border">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Your current freedom points
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Ionicons name="flash" size={16} color={colors.white} />
            </View>
            <Text className="text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
              {formatNumber(freedomPoints)}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

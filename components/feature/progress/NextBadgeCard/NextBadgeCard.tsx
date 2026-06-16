import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeWithStatus } from "@/types/progress/progress";
import { progressToPercent } from "@/utils/progress/achievementProgress";

type Props = {
  currentBadge: BadgeWithStatus | null;
  progress: number;
  hasNextTarget: boolean;
};

export function NextBadgeCard({ currentBadge, progress, hasNextTarget }: Props) {
  const { colors } = useTheme();
  const pct = progressToPercent(progress);

  if (!currentBadge && !hasNextTarget) {
    return (
      <Animated.View entering={FadeInDown.duration(420)}>
        <Card variant="section" className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="sparkles" size={18} color={colors.white} />
          </View>
          <Text className="flex-1 text-sm font-semibold text-foreground dark:text-d-text">
            Every badge is unlocked. You set the bar now.
          </Text>
        </Card>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="relative mr-3">
            {currentBadge ? (
              <BadgeArt badgeId={currentBadge.id} size={48} />
            ) : (
              <View
                className="h-12 w-12 items-center justify-center rounded-full bg-section dark:bg-d-surface"
                style={{ borderWidth: 1, borderColor: colors.border }}
              >
                <Ionicons name="ribbon-outline" size={22} color={colors.mutedForeground} />
              </View>
            )}
            {currentBadge?.unlocked ? (
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-accent">
                <Ionicons name="checkmark" size={12} color={colors.white} />
              </View>
            ) : null}
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Current badge
            </Text>
            <Text className="mt-0.5 text-base font-bold text-foreground dark:text-d-text">
              {currentBadge?.name ?? "—"}
            </Text>
          </View>
          {hasNextTarget ? (
            <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
              {pct}%
            </Text>
          ) : null}
        </View>

        {hasNextTarget ? (
          <View className="mt-3">
            <ProgressBar progress={progress} fillClassName="bg-accent" />
          </View>
        ) : null}
      </Card>
    </Animated.View>
  );
}

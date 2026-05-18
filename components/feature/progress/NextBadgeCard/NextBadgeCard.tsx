import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeWithStatus } from "@/types/progress";
import { pluralize } from "@/utils/format";

type Props = {
  badge: BadgeWithStatus | null;
};

export function NextBadgeCard({ badge }: Props) {
  const { colors } = useTheme();

  if (!badge) {
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
          <View className="mr-3">
            <BadgeArt badgeId={badge.id} size={48} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Next badge
            </Text>
            <Text className="mt-0.5 text-base font-bold text-foreground dark:text-d-text">
              {badge.name}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
            {badge.daysLeft} {pluralize(badge.daysLeft, "day")} left
          </Text>
        </View>

        <View className="mt-3">
          <ProgressBar progress={badge.progress} fillClassName="bg-accent" />
        </View>
        <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
          {badge.description}
        </Text>
      </Card>
    </Animated.View>
  );
}

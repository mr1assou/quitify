import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeProgress } from "@/utils/calculations";
import { pluralize } from "@/utils/format";

type Props = {
  badgeProgress: BadgeProgress;
  daysQuit: number;
};

export function NextBadge({ badgeProgress, daysQuit }: Props) {
  const { colors } = useTheme();
  const { current, next, progress } = badgeProgress;

  return (
    <Animated.View entering={FadeIn.duration(450)}>
      <Card variant="section">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Ionicons name="trophy" size={18} color={colors.white} />
            </View>
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
                Current rank
              </Text>
              <Text className="text-base font-bold text-foreground dark:text-d-text">
                {current?.name ?? "Just starting"}
              </Text>
            </View>
          </View>
          {next ? (
            <Text className="text-xs font-semibold text-muted-foreground dark:text-d-muted">
              {Math.max(0, Math.ceil(next.daysRequired - daysQuit))}{" "}
              {pluralize(Math.ceil(next.daysRequired - daysQuit), "day")} left
            </Text>
          ) : (
            <Text className="text-xs font-semibold text-accent">All unlocked</Text>
          )}
        </View>

        <View className="mt-4">
          <ProgressBar progress={progress} />
          {next ? (
            <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
              Next: <Text className="font-semibold text-foreground dark:text-d-text">{next.name}</Text>{" "}
              at day {next.daysRequired}
            </Text>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { JourneyMilestone } from "@/types/stats/statsDashboard";
import { formatDate } from "@/utils/shared/format";

type Props = {
  milestones: JourneyMilestone[];
};

export function MilestonesTimeline({ milestones }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="trophy" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Milestones
            </Text>
            <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">
              Day-by-day reminders of how far you&apos;ve come.
            </Text>
          </View>
        </View>

        <View className="mt-4">
          {milestones.map((m, i) => (
            <TimelineRow
              key={m.day}
              milestone={m}
              isFirst={i === 0}
              isLast={i === milestones.length - 1}
            />
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

function TimelineRow({
  milestone,
  isFirst,
  isLast,
}: {
  milestone: JourneyMilestone;
  isFirst: boolean;
  isLast: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row">
      <View className="items-center" style={{ width: 28 }}>
        <View
          className={`${isFirst ? "" : "h-3"} w-px ${
            milestone.reached ? "bg-accent" : "bg-section dark:bg-d-elevated"
          }`}
        />
        <View
          className={`h-5 w-5 items-center justify-center rounded-full ${
            milestone.reached ? "bg-accent" : "bg-section dark:bg-d-elevated"
          }`}
        >
          {milestone.reached ? (
            <Ionicons name="checkmark" size={12} color={colors.white} />
          ) : null}
        </View>
        <View
          className={`${isLast ? "" : "flex-1"} w-px ${
            milestone.reached ? "bg-accent" : "bg-section dark:bg-d-elevated"
          }`}
        />
      </View>
      <View className="ml-3 flex-1 pb-4">
        <Text
          className={`text-sm font-semibold ${
            milestone.reached
              ? "text-foreground dark:text-d-text"
              : "text-muted-foreground dark:text-d-muted"
          }`}
        >
          {milestone.label}
        </Text>
        <Text className="mt-0.5 text-xs leading-4 text-muted-foreground dark:text-d-muted">
          {milestone.description}
        </Text>
        <Text className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground dark:text-d-muted">
          {milestone.reached ? "Reached" : "Unlocks"} · {formatDate(milestone.unlocksAt)}
        </Text>
      </View>
    </View>
  );
}

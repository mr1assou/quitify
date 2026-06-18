import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { getGoalTypeConfig } from "@/constants/goals/goals";
import { useTheme } from "@/context/ThemeContext";
import type { UserGoal } from "@/types/goals/goal";
import { formatGoalProgressLabel, formatGoalTitle } from "@/utils/goals/goalLabels";
import type { GoalProgress } from "@/utils/goals/goalProgress";

type Props = {
  goal: UserGoal;
  progress: GoalProgress;
  currencySymbol: string;
  onPress?: () => void;
};

export function ActiveGoalCard({
  goal,
  progress,
  currencySymbol,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const config = getGoalTypeConfig(goal.type);

  const content = (
    <>
      <View className="flex-row items-center gap-3">
        <View
          style={{ backgroundColor: colors.primary }}
          className="h-11 w-11 items-center justify-center rounded-2xl"
        >
          <Ionicons name={config.icon} size={22} color="#fff" />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Your goal
          </Text>
          <Text className="mt-0.5 text-base font-bold text-foreground dark:text-d-text">
            {formatGoalTitle(goal, currencySymbol)}
          </Text>
        </View>
        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        ) : null}
      </View>

      <View className="mt-4">
        <ProgressBar progress={progress.progress} fillClassName="bg-primary" />
        <Text className="mt-2 text-sm font-semibold text-foreground dark:text-d-text">
          {formatGoalProgressLabel(goal, progress.current, currencySymbol)}
        </Text>
        {progress.isComplete ? (
          <Text className="mt-1 text-sm font-semibold text-primary">Goal reached!</Text>
        ) : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View className="rounded-3xl bg-section p-4 dark:bg-d-surface">{content}</View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl bg-section p-4 dark:bg-d-surface"
    >
      {content}
    </Pressable>
  );
}

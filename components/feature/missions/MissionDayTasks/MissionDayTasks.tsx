import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { MissionDayTaskCard } from "@/components/feature/missions/MissionDayTaskCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useTheme } from "@/context/ThemeContext";
import type { MissionPlan } from "@/hooks/progress/useMissionPlan";

type Props = {
  plan: MissionPlan;
};

export function MissionDayTasks({ plan }: Props) {
  const { colors } = useTheme();
  const {
    selectedDay,
    currentDay,
    tasks,
    completedCount,
    totalCount,
    progress,
    isComplete,
    canToggleTasks,
    toggleTask,
  } = plan;

  const locked = selectedDay > currentDay;

  return (
    <Animated.View entering={FadeIn.duration(350)} className="mt-8 px-6">
      {!locked ? (
        <>
          <ProgressBar
            progress={progress}
            fillClassName={isComplete ? "bg-accent" : "bg-primary"}
          />
          <Text className="mt-2 text-xs text-muted-foreground dark:text-d-muted">
            {completedCount}/{totalCount} tasks done
            {!canToggleTasks ? " · view only" : ""}
          </Text>

          <View className="mt-4 gap-3">
            {tasks.map((task, index) => (
              <MissionDayTaskCard
                key={task.id}
                task={task}
                index={index}
                interactive={canToggleTasks}
                onToggle={toggleTask}
              />
            ))}
          </View>
        </>
      ) : (
        <View className="items-center rounded-3xl bg-section px-6 py-10 dark:bg-d-surface">
          <Ionicons name="lock-closed" size={28} color={colors.mutedForeground} />
          <Text className="mt-3 text-center text-sm text-muted-foreground dark:text-d-muted">
            Complete earlier days to unlock this part of your quit plan.
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MissionTaskCardStack } from "@/components/feature/missions/MissionTaskCardStack";
import { missionPlanLabel } from "@/constants/progress/plan";
import { useTheme } from "@/context/ThemeContext";
import { useMissionDayTasks } from "@/hooks/progress/useMissionDayTasks";
import { safeRouter } from "@/utils/app/safeRouter";

type Props = {
  missionDay: number;
};

export function MissionDayTasksScreen({ missionDay }: Props) {
  const { colors } = useTheme();
  const session = useMissionDayTasks(missionDay);

  if (session.isLocked || !session.dayPlan) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="lock-closed" size={32} color={colors.mutedForeground} />
          <Text className="mt-4 text-center text-base text-muted-foreground dark:text-d-muted">
            {session.unlockedThroughDay <= 0
              ? "Your plan unlocks when your quit day begins. Finish onboarding with a quit date to start Day 1."
              : "Complete earlier days to unlock this plan."}
          </Text>
          <Pressable onPress={() => safeRouter.back()} className="mt-6 active:opacity-70">
            <Text className="text-base font-semibold text-primary">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 pt-2">
        <Pressable
          onPress={() => safeRouter.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-section/60 dark:active:bg-d-surface/80"
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="ml-2 flex-1 text-lg font-bold text-foreground dark:text-d-text">
          {missionPlanLabel(missionDay)}
        </Text>
        <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
          {session.completedCount}/{session.totalCount}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6 pb-6 pt-2">
        <MissionTaskCardStack
          tasks={session.tasks}
          currentIndex={session.currentIndex}
          onIndexChange={session.goToIndex}
          interactive={session.canToggleTasks}
          onToggle={session.toggleTask}
          togglingTaskId={session.togglingTaskId}
        />
      </View>
    </SafeAreaView>
  );
}

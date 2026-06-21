import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActiveGoalCard } from "@/components/feature/goals/ActiveGoalCard";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { Button } from "@/components/ui/Button";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import type { UserGoal } from "@/types/goals/goal";
import { safeRouter } from "@/utils/app/safeRouter";
import { computeGoalProgress } from "@/utils/goals/goalProgress";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  goalId: number;
};

export function GoalManageScreen({ goalId }: Props) {
  const { state } = useApp();
  const { goals, progress, deleteGoal, refresh, isReady } = useUserGoals();

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const close = useCallback(() => safeRouter.back(), []);

  const goal = goals.find((item) => item.id === goalId);
  const isActive = goal?.status === "active";

  const handleEdit = useCallback(() => {
    safeRouter.pushStack({
      pathname: "/goals/edit",
      params: { id: String(goalId) },
    });
  }, [goalId]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete goal?", "This will remove your current goal.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteGoal(goalId)
            .then(() => safeRouter.back())
            .catch(() => Alert.alert("Could not delete goal", "Please try again."));
        },
      },
    ]);
  }, [deleteGoal, goalId]);

  if (!state.profile) return null;
  if (!isReady) return <ThemedLoadingScreen />;

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
        <CravingSessionHeader title="Your goal" showBack onBack={close} onClose={close} />
        <View className="flex-1 px-6 pt-8">
          <Button label="Go back" variant="secondary" fullWidth onPress={close} />
        </View>
      </SafeAreaView>
    );
  }

  const symbol = currencySymbol(state.profile.currency);
  const goalProgress = computeGoalProgress(goal, progress);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <CravingSessionHeader title="Your goal" showBack onBack={close} onClose={close} />

      <View className="flex-1 px-6 pt-4">
        <ActiveGoalCard
          goal={goal}
          progress={goalProgress}
          currencySymbol={symbol}
        />

        {isActive ? (
          <View className="mt-6 gap-3">
            <Button label="Edit goal" size="lg" fullWidth onPress={handleEdit} />
            <Button
              label="Delete goal"
              size="lg"
              fullWidth
              variant="danger"
              onPress={handleDelete}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

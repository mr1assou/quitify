import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActiveGoalCard } from "@/components/feature/goals/ActiveGoalCard";
import { GoalActionModals, type GoalModalState } from "@/components/feature/goals/GoalActionModals";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { Button } from "@/components/ui/Button";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import { safeRouter } from "@/utils/app/safeRouter";
import { computeGoalProgress } from "@/utils/goals/goalProgress";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  goalId: number;
};

export function GoalManageScreen({ goalId }: Props) {
  const { state } = useApp();
  const { goals, progress, deleteGoal, refresh, isReady } = useUserGoals();
  const [goalModal, setGoalModal] = useState<GoalModalState | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const close = useCallback(() => safeRouter.back(), []);

  const goal = goals.find((item) => item.id === goalId);
  const isActive = goal?.status === "active";

  const closeGoalModal = useCallback(() => {
    setGoalModal(null);
  }, []);

  const handleEdit = useCallback(() => {
    safeRouter.pushStack({
      pathname: "/goals/edit",
      params: { id: String(goalId) },
    });
  }, [goalId]);

  const handleDeletePress = useCallback(() => {
    setGoalModal({ type: "confirmDelete" });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    setGoalModal({ type: "deleting" });
    deleteGoal(goalId)
      .then(() => {
        setGoalModal(null);
        safeRouter.back();
      })
      .catch(() => {
        setGoalModal({
          type: "error",
          title: "Could not delete goal",
          message: "Please try again.",
        });
      });
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
              onPress={handleDeletePress}
            />
          </View>
        ) : null}
      </View>

      <GoalActionModals
        state={goalModal}
        onClose={closeGoalModal}
        onConfirmDelete={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}

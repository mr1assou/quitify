import { useFocusEffect, Redirect } from "expo-router";
import { useCallback } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GoalTargetPicker } from "@/components/feature/goals/GoalsPicker";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import { useNow } from "@/hooks/shared/useNow";
import { safeRouter } from "@/utils/app/safeRouter";

const GOAL_TYPE = "smoke_free_days" as const;

type Props = {
  mode?: "create" | "edit";
  goalId?: number;
};

export function GoalTargetScreen({ mode = "create", goalId }: Props) {
  const { state } = useApp();
  const { goals, minTargets, setGoal, refresh, isReady } = useUserGoals();
  const now = useNow(1000);
  const isEdit = mode === "edit";

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const close = useCallback(() => safeRouter.back(), []);

  const goal = goalId != null ? goals.find((item) => item.id === goalId) : undefined;

  const handleConfirm = useCallback(
    async (days: number) => {
      try {
        await setGoal(GOAL_TYPE, days);
        safeRouter.back();
      } catch {
        Alert.alert("Could not save goal", "Please try again.");
      }
    },
    [setGoal],
  );

  if (!state.profile) return null;
  if (!isReady) return <ThemedLoadingScreen />;

  if (isEdit && (!goal || goal.status !== "active")) {
    return <Redirect href="/(tabs)" />;
  }

  const economics = {
    cigarettesPerDay: state.profile.cigarettesPerDay,
    cigarettesPerPack: state.profile.cigarettesPerPack,
    packPrice: state.profile.packCost,
  };

  const initialDays = isEdit && goal ? Math.round(goal.target) : undefined;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <CravingSessionHeader
        title={isEdit ? "Edit goal" : "Create a goal"}
        showBack
        onBack={close}
        onClose={close}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 }}
          keyboardShouldPersistTaps="always"
        >
          <GoalTargetPicker
            streakStart={state.profile.streakStart}
            now={now}
            currency={state.profile.currency}
            economics={economics}
            minDaysAheadFromServer={minTargets.smoke_free_days}
            initialDays={initialDays}
            confirmLabel={isEdit ? "Save changes" : "Set goal"}
            onConfirm={handleConfirm}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GoalsTypePicker } from "@/components/feature/goals/GoalsPicker";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import type { GoalType } from "@/types/goals/goal";
import { safeRouter } from "@/utils/app/safeRouter";

export function GoalsScreen() {
  const { state } = useApp();
  const { activeGoals, refresh, isReady } = useUserGoals();

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const close = useCallback(() => safeRouter.back(), []);

  const openGoalType = useCallback((type: GoalType) => {
    safeRouter.pushStack(`/goals/${type}`);
  }, []);

  const activeGoalTypes = useMemo(
    () => activeGoals.map((goal) => goal.type),
    [activeGoals],
  );

  if (!state.profile) return null;
  if (!isReady) return <ThemedLoadingScreen />;

  const pickerHeading =
    activeGoals.length > 0 ? "Add another goal" : "Choose a goal";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <CravingSessionHeader title="Your goals" showBack onBack={close} onClose={close} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
      >
        <GoalsTypePicker
          onPickType={openGoalType}
          lockedTypes={activeGoalTypes}
          heading={pickerHeading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

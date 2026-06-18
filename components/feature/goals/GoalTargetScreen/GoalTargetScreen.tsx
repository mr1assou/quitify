import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GoalTargetPicker } from "@/components/feature/goals/GoalsPicker";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { getGoalTypeConfig } from "@/constants/goals/goals";
import { useApp } from "@/context/AppContext";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import type { GoalType } from "@/types/goals/goal";
import { safeRouter } from "@/utils/app/safeRouter";
import { parseGoalTargetInput } from "@/utils/goals/goalTargetInput";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  type: GoalType;
};

export function GoalTargetScreen({ type }: Props) {
  const { state } = useApp();
  const { minTargets, strictMinTargets, setGoal, refresh, isReady } = useUserGoals();
  const [input, setInput] = useState("");

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => {});
    }, [refresh]),
  );

  const close = useCallback(() => safeRouter.back(), []);

  const handleConfirm = useCallback(async () => {
    const target = parseGoalTargetInput(type, input);
    if (target == null) return;

    await setGoal(type, target);
    safeRouter.back();
  }, [input, setGoal, type]);

  if (!state.profile) return null;
  if (!isReady) return <ThemedLoadingScreen />;

  const symbol = currencySymbol(state.profile.currency);
  const minTarget = minTargets[type];
  const title = getGoalTypeConfig(type).title;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top", "bottom"]}>
      <CravingSessionHeader title={title} showBack onBack={close} onClose={close} />

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
            type={type}
            minTarget={minTarget}
            strictMinTargets={strictMinTargets}
            value={input}
            currencySymbol={symbol}
            onChangeValue={setInput}
            onConfirm={handleConfirm}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import {
  AnalyzingProgress,
  type AnalyzingTask,
} from "@/components/feature/onboarding/AnalyzingProgress";

const TASKS: readonly AnalyzingTask[] = [
  {
    id: "analyze",
    label: "Analyzing your information",
    durationMs: 2400,
    icon: "search-outline",
  },
  {
    id: "plan",
    label: "Generating your personalized plan",
    durationMs: 2800,
    icon: "construct-outline",
  },
  {
    id: "tips",
    label: "Preparing tips & milestones",
    durationMs: 2200,
    icon: "sparkles-outline",
  },
];

export default function OnboardingAnalyzing() {
  const onComplete = useCallback(() => {
    safeRouter.replace("/onboarding/profile");
  }, []);

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <AnalyzingProgress tasks={TASKS} onComplete={onComplete} />
        </View>
      </ScrollView>
    </ScreenCanvas>
  );
}

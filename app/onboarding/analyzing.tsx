import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import {
  AnalyzingProgress,
  type AnalyzingTask,
} from "@/components/feature/onboarding/AnalyzingProgress";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ONBOARDING_STEP } from "@/constants/analytics/onboarding";
import { trackOnboardingStepComplete } from "@/services/analytics";

export default function OnboardingAnalyzing() {
  const { t } = useTranslation();

  const tasks = useMemo<readonly AnalyzingTask[]>(
    () => [
      {
        id: "analyze",
        label: t("onboarding.analyzing.task1"),
        durationMs: 2400,
        icon: "search-outline",
      },
      {
        id: "plan",
        label: t("onboarding.analyzing.task2"),
        durationMs: 2800,
        icon: "construct-outline",
      },
      {
        id: "tips",
        label: t("onboarding.analyzing.task3"),
        durationMs: 2200,
        icon: "sparkles-outline",
      },
    ],
    [t],
  );

  const onComplete = useCallback(() => {
    trackOnboardingStepComplete(ONBOARDING_STEP.analyzing);
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
          <AnalyzingProgress tasks={tasks} onComplete={onComplete} />
        </View>
      </ScrollView>
    </ScreenCanvas>
  );
}

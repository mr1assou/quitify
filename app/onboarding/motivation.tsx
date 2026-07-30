import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { MotivationStep } from "@/components/feature/onboarding/MotivationStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ONBOARDING_STEP } from "@/constants/analytics/onboarding";
import { trackOnboardingStepComplete } from "@/services/analytics";

export default function Motivation() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const level = draft.motivationLevel;

  return (
    <OnboardingShell
      step={2}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.motivation.title")}
      subtitle={t("onboarding.motivation.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!level}
      onPrimary={() => {
        trackOnboardingStepComplete(ONBOARDING_STEP.motivation);
        safeRouter.push("/onboarding/quit-attempts");
      }}
      showBack
    >
      <View className="w-full">
        <MotivationStep
          selected={level}
          onSelect={(motivationLevel) => patch({ motivationLevel })}
        />
      </View>
    </OnboardingShell>
  );
}

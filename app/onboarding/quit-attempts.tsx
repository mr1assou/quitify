import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { QuitAttemptsPickStep } from "@/components/feature/onboarding/QuitAttemptsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function QuitAttempts() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const choice = draft.priorQuitAttempts;

  return (
    <OnboardingShell
      step={3}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.quitAttempts.title")}
      subtitle={t("onboarding.quitAttempts.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!choice}
      onPrimary={() => safeRouter.push("/onboarding/interests")}
      showBack
    >
      <View className="w-full">
        <QuitAttemptsPickStep
          selected={choice}
          onSelect={(value) => patch({ priorQuitAttempts: value })}
        />
      </View>
    </OnboardingShell>
  );
}

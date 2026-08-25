import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { QuitAttemptsPickStep } from "@/components/feature/onboarding/QuitAttemptsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { PriorQuitAttempts } from "@/types/onboarding/onboarding";

export default function QuitAttempts() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const choice = draft.priorQuitAttempts;
  const otherText = draft.priorQuitAttemptsOtherText ?? "";
  const otherSelected = choice === ONBOARDING_OTHER_ID;

  const canContinue =
    choice != null && (!otherSelected || otherText.trim().length > 0);

  return (
    <OnboardingShell
      step={3}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.quitAttempts.title")}
      subtitle={t("onboarding.quitAttempts.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        safeRouter.push("/onboarding/interests");
      }}
      showBack
    >
      <View className="w-full">
        <QuitAttemptsPickStep
          selected={choice}
          onSelect={(value: PriorQuitAttempts) =>
            patch({
              priorQuitAttempts: value,
              ...(value !== ONBOARDING_OTHER_ID
                ? { priorQuitAttemptsOtherText: "" }
                : null),
            })
          }
          onClearOther={() =>
            patch({
              priorQuitAttempts: undefined,
              priorQuitAttemptsOtherText: "",
            })
          }
          otherText={otherText}
          otherPlaceholder={t("onboarding.quitAttempts.otherPlaceholder")}
          onOtherTextChange={(text) =>
            patch({ priorQuitAttemptsOtherText: text })
          }
        />
      </View>
    </OnboardingShell>
  );
}

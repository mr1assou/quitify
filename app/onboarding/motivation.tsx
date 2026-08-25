import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { MotivationStep } from "@/components/feature/onboarding/MotivationStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { MotivationLevel } from "@/types/onboarding/onboarding";

export default function Motivation() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const level = draft.motivationLevel;
  const otherText = draft.motivationOtherText ?? "";
  const otherSelected = level === ONBOARDING_OTHER_ID;

  const canContinue =
    level != null && (!otherSelected || otherText.trim().length > 0);

  return (
    <OnboardingShell
      step={2}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.motivation.title")}
      subtitle={t("onboarding.motivation.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        safeRouter.push("/onboarding/quit-attempts");
      }}
      showBack
    >
      <View className="w-full">
        <MotivationStep
          selected={level}
          onSelect={(motivationLevel: MotivationLevel) =>
            patch({
              motivationLevel,
              ...(motivationLevel !== ONBOARDING_OTHER_ID
                ? { motivationOtherText: "" }
                : null),
            })
          }
          onClearOther={() =>
            patch({ motivationLevel: undefined, motivationOtherText: "" })
          }
          otherText={otherText}
          otherPlaceholder={t("onboarding.motivation.otherPlaceholder")}
          onOtherTextChange={(text) => patch({ motivationOtherText: text })}
        />
      </View>
    </OnboardingShell>
  );
}

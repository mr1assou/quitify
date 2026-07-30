import { safeRouter } from "@/utils/app/safeRouter";
import { useMemo } from "react";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ReasonsPickStep } from "@/components/feature/onboarding/ReasonsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { QUIT_REASON_OPTIONS } from "@/constants/onboarding/onboardingReasons";
import { useOnboarding } from "@/context/OnboardingContext";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ONBOARDING_STEP } from "@/constants/analytics/onboarding";
import { trackOnboardingStepComplete } from "@/services/analytics";

export default function Reasons() {
  const { t } = useTranslation();
  const { localize } = useLocalizedCatalog();
  const { draft, patch } = useOnboarding();
  const quitReasonIds = draft.quitReasonIds ?? [];

  const options = useMemo(
    () => localize(QUIT_REASON_OPTIONS, "onboarding.reasons", ["label"]),
    [localize],
  );

  const toggle = (id: string) => {
    const has = quitReasonIds.includes(id);
    patch({
      quitReasonIds: has
        ? quitReasonIds.filter((x) => x !== id)
        : [...quitReasonIds, id],
    });
  };

  const canContinue = quitReasonIds.length > 0;

  return (
    <OnboardingShell
      step={1}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.reasons.title")}
      subtitle={t("onboarding.reasons.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        trackOnboardingStepComplete(ONBOARDING_STEP.reasons);
        safeRouter.push("/onboarding/motivation");
      }}
      showBack={false}
    >
      <View className="w-full">
        <ReasonsPickStep
          options={options}
          selectedIds={quitReasonIds}
          onToggle={toggle}
        />
      </View>
    </OnboardingShell>
  );
}

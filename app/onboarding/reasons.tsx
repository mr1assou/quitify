import { safeRouter } from "@/utils/app/safeRouter";
import { useMemo } from "react";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ReasonsPickStep } from "@/components/feature/onboarding/ReasonsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import { QUIT_REASON_OPTIONS } from "@/constants/onboarding/onboardingReasons";
import { useOnboarding } from "@/context/OnboardingContext";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function Reasons() {
  const { t } = useTranslation();
  const { localize } = useLocalizedCatalog();
  const { draft, patch } = useOnboarding();
  const quitReasonIds = draft.quitReasonIds ?? [];
  const otherText = draft.quitReasonOtherText ?? "";
  const otherSelected = quitReasonIds.includes(ONBOARDING_OTHER_ID);

  const options = useMemo(
    () => localize(QUIT_REASON_OPTIONS, "onboarding.reasons", ["label"]),
    [localize],
  );

  const toggle = (id: string) => {
    const has = quitReasonIds.includes(id);
    const nextIds = has
      ? quitReasonIds.filter((x) => x !== id)
      : [...quitReasonIds, id];

    patch({
      quitReasonIds: nextIds,
      ...(id === ONBOARDING_OTHER_ID && has ? { quitReasonOtherText: "" } : null),
    });
  };

  const canContinue =
    quitReasonIds.length > 0 &&
    (!otherSelected || otherText.trim().length > 0);

  return (
    <OnboardingShell
      step={1}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.reasons.title")}
      subtitle={t("onboarding.reasons.subtitle")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        safeRouter.push("/onboarding/motivation");
      }}
      showBack={false}
    >
      <View className="w-full">
        <ReasonsPickStep
          options={options}
          selectedIds={quitReasonIds}
          onToggle={toggle}
          otherSelected={otherSelected}
          otherText={otherText}
          otherPlaceholder={t("onboarding.reasons.otherPlaceholder")}
          onOtherTextChange={(text) => patch({ quitReasonOtherText: text })}
        />
      </View>
    </OnboardingShell>
  );
}

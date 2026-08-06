import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { InterestPickStep } from "@/components/feature/onboarding/InterestPickStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import type { PrimaryInterestId } from "@/types";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { ONBOARDING_STEP } from "@/constants/analytics/onboarding";
import { trackOnboardingStepComplete } from "@/services/analytics";

export default function Interests() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const selectedIds = draft.primaryInterestIds ?? [];
  const otherText = draft.primaryInterestOtherText ?? "";
  const otherSelected = selectedIds.includes(ONBOARDING_OTHER_ID);

  const toggle = (id: PrimaryInterestId) => {
    const has = selectedIds.includes(id);
    patch({
      primaryInterestIds: has
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
      ...(id === ONBOARDING_OTHER_ID && has
        ? { primaryInterestOtherText: "" }
        : null),
    });
  };

  const canContinue =
    selectedIds.length > 0 &&
    (!otherSelected || otherText.trim().length > 0);

  return (
    <OnboardingShell
      step={4}
      total={ONBOARDING_TOTAL_STEPS}
      title={t("onboarding.interests.title")}
      primaryLabel={t("common.continue")}
      primaryDisabled={!canContinue}
      onPrimary={() => {
        trackOnboardingStepComplete(ONBOARDING_STEP.interests);
        safeRouter.push("/onboarding/create-profile");
      }}
      showBack
      scrollBody
    >
      <View className="w-full min-h-0 flex-1">
        <InterestPickStep
          selectedIds={selectedIds}
          onToggle={toggle}
          otherSelected={otherSelected}
          otherText={otherText}
          otherPlaceholder={t("onboarding.interests.otherPlaceholder")}
          onOtherTextChange={(text) =>
            patch({ primaryInterestOtherText: text })
          }
        />
      </View>
    </OnboardingShell>
  );
}

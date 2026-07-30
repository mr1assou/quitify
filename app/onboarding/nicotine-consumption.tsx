import { safeRouter } from "@/utils/app/safeRouter";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { NicotineConsumptionFields } from "@/components/feature/onboarding/NicotineConsumptionFields";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { CIGARETTE_CONSUMPTION_FORM } from "@/constants/onboarding/onboardingNicotineForm";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  getNicotineFieldErrors,
  isNicotineConsumptionStepComplete,
} from "@/utils/onboarding/nicotineOnboarding";
import { ONBOARDING_STEP } from "@/constants/analytics/onboarding";
import { trackOnboardingStepComplete } from "@/services/analytics";

export default function NicotineConsumptionOnboarding() {
  const { t } = useTranslation();
  const { draft, patch } = useOnboarding();
  const [attemptedContinue, setAttemptedContinue] = useState(false);

  useEffect(() => {
    const next: Parameters<typeof patch>[0] = {};
    if (draft.nicotineConsumptionForm !== CIGARETTE_CONSUMPTION_FORM) {
      next.nicotineConsumptionForm = CIGARETTE_CONSUMPTION_FORM;
    }
    if (Object.keys(next).length > 0) patch(next);
  }, [draft.nicotineConsumptionForm, patch]);

  const canContinue = useMemo(() => isNicotineConsumptionStepComplete(draft), [draft]);

  const fieldErrors = useMemo(() => {
    if (!attemptedContinue) return {};
    return getNicotineFieldErrors(draft);
  }, [attemptedContinue, draft]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <OnboardingShell
        step={6}
        total={ONBOARDING_TOTAL_STEPS}
        title={t("onboarding.nicotine.title")}
        primaryLabel={t("common.continue")}
        primaryDisabled={!canContinue}
        primaryPressWhenDisabled
        onPrimary={() => {
          if (!canContinue) {
            setAttemptedContinue(true);
            return;
          }
          trackOnboardingStepComplete(ONBOARDING_STEP.nicotine);
          safeRouter.push("/onboarding/analyzing");
        }}
        showBack
        scrollBody
      >
        <ScrollView
          className="w-full flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full pb-6">
            <NicotineConsumptionFields
              draft={draft}
              patch={patch}
              fieldErrors={fieldErrors}
            />
          </View>
        </ScrollView>
      </OnboardingShell>
    </KeyboardAvoidingView>
  );
}

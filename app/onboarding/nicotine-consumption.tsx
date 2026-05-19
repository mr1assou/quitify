import { safeRouter } from "@/utils/safeRouter";
import { useEffect, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { NicotineConsumptionFields } from "@/components/feature/onboarding/NicotineConsumptionFields";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { CIGARETTE_CONSUMPTION_FORM } from "@/constants/onboardingNicotineForm";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";
import { useQuitPlanHandlers } from "@/hooks/useQuitPlanHandlers";
import { isNicotineConsumptionStepComplete } from "@/utils/nicotineOnboarding";

export default function NicotineConsumptionOnboarding() {
  const { draft, patch } = useOnboarding();
  const { selectMethod } = useQuitPlanHandlers(draft, patch);

  useEffect(() => {
    if (draft.nicotineConsumptionForm !== CIGARETTE_CONSUMPTION_FORM) {
      patch({ nicotineConsumptionForm: CIGARETTE_CONSUMPTION_FORM });
    }
  }, [draft.nicotineConsumptionForm, patch]);

  const canContinue = useMemo(() => isNicotineConsumptionStepComplete(draft), [draft]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <OnboardingShell
        step={6}
        total={ONBOARDING_TOTAL_STEPS}
        title="Your cigarette habits"
        primaryLabel="Continue"
        primaryDisabled={!canContinue}
        onPrimary={() => safeRouter.push("/onboarding/analyzing")}
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
              onSelectQuitMethod={selectMethod}
            />
          </View>
        </ScrollView>
      </OnboardingShell>
    </KeyboardAvoidingView>
  );
}

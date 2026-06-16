import { safeRouter } from "@/utils/app/safeRouter";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { CountryFields } from "@/components/feature/onboarding/CountryFields";
import { CreateProfileStep } from "@/components/feature/onboarding/CreateProfileStep";
import { QuitDateFields } from "@/components/feature/onboarding/QuitDateFields";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { OnboardingSectionDivider } from "@/components/feature/onboarding/shared/OnboardingSectionDivider";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import type { ProfileSex } from "@/types";
import { useOnboarding } from "@/context/OnboardingContext";
import { useQuitPlanHandlers } from "@/hooks/onboarding/useQuitPlanHandlers";
import { isCreateProfileStepComplete } from "@/utils/onboarding/createProfileOnboarding";

export default function OnboardingCreateProfile() {
  const { draft, patch } = useOnboarding();
  const quitDateHandlers = useQuitPlanHandlers(draft, patch);

  const canContinue = useMemo(
    () => isCreateProfileStepComplete(draft),
    [draft],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <OnboardingShell
        step={5}
        total={ONBOARDING_TOTAL_STEPS}
        title="Let's create your profile now"
        primaryLabel="Continue"
        primaryDisabled={!canContinue}
        onPrimary={() => safeRouter.push("/onboarding/nicotine-consumption")}
        showBack
        scrollBody
      >
        <ScrollView
          className="w-full flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        >
          <View className="gap-8 pb-2">
            <CreateProfileStep
              username={draft.username}
              onUsernameChange={(username) => patch({ username })}
              sex={draft.sex}
              onSexChange={(sex: ProfileSex) => patch({ sex })}
            />
            <OnboardingSectionDivider />
            <CountryFields draft={draft} patch={patch} />
            <OnboardingSectionDivider />
            <QuitDateFields
              draft={draft}
              onSelectPreset={quitDateHandlers.selectPreset}
              onMonthChange={quitDateHandlers.updateCustomMonth}
              onDayChange={quitDateHandlers.updateCustomDay}
              onYearChange={quitDateHandlers.updateCustomYear}
            />
          </View>
        </ScrollView>
      </OnboardingShell>
    </KeyboardAvoidingView>
  );
}

import { router } from "expo-router";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import { CreateProfileStep } from "@/components/feature/onboarding/CreateProfileStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboardingFlow";
import type { ProfileSex } from "@/types";
import { useOnboarding } from "@/context/OnboardingContext";
import { parseBirthYmd } from "@/utils/birthdate";

export default function OnboardingCreateProfile() {
  const { draft, patch } = useOnboarding();

  const canContinue = useMemo(() => {
    const t = draft.username.trim();
    const bd =
      draft.birthYear != null && draft.birthMonth != null && draft.birthDay != null
        ? parseBirthYmd(draft.birthYear, draft.birthMonth, draft.birthDay)
        : null;
    return t.length > 0 && draft.sex !== undefined && bd !== null;
  }, [
    draft.username,
    draft.sex,
    draft.birthYear,
    draft.birthMonth,
    draft.birthDay,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <OnboardingShell
        step={5}
        total={ONBOARDING_TOTAL_STEPS}
        title="Let's create your profile now"
        subtitle="A few details so Quitify can greet you properly and tailor the experience."
        primaryLabel="Continue"
        primaryDisabled={!canContinue}
        onPrimary={() => router.push("/onboarding/nicotine-consumption")}
        showBack
        scrollBody
      >
        <ScrollView
          className="w-full flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        >
          <View className="pb-2">
            <CreateProfileStep
              username={draft.username}
              onUsernameChange={(username) => patch({ username })}
              sex={draft.sex}
              onSexChange={(sex: ProfileSex) => patch({ sex })}
              birthMonth={draft.birthMonth}
              birthDay={draft.birthDay}
              birthYear={draft.birthYear}
              onBirthMonthChange={(birthMonth) => patch({ birthMonth })}
              onBirthDayChange={(birthDay) => patch({ birthDay })}
              onBirthYearChange={(birthYear) => patch({ birthYear })}
            />
          </View>
        </ScrollView>
      </OnboardingShell>
    </KeyboardAvoidingView>
  );
}

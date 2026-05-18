import { router } from "expo-router";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { QuitAttemptsPickStep } from "@/components/feature/onboarding/QuitAttemptsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";

export default function QuitAttempts() {
  const { draft, patch } = useOnboarding();
  const choice = draft.priorQuitAttempts;

  return (
    <OnboardingShell
      step={3}
      total={ONBOARDING_TOTAL_STEPS}
      title="How many times have you tried to quit smoking?"
      subtitle="Choose the option that fits you best. There is no wrong answer."
      primaryLabel="Continue"
      primaryDisabled={!choice}
      onPrimary={() => router.push("/onboarding/interests")}
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

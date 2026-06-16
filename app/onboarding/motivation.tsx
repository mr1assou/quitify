import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";

import { MotivationStep } from "@/components/feature/onboarding/MotivationStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboarding/onboardingFlow";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Motivation() {
  const { draft, patch } = useOnboarding();
  const level = draft.motivationLevel;

  return (
    <OnboardingShell
      step={2}
      total={ONBOARDING_TOTAL_STEPS}
      title="How motivated are you to stop smoking?"
      subtitle="Choose the level that fits you today. There is no wrong answer."
      primaryLabel="Continue"
      primaryDisabled={!level}
      onPrimary={() => safeRouter.push("/onboarding/quit-attempts")}
      showBack
    >
      <View className="w-full">
        <MotivationStep
          selected={level}
          onSelect={(motivationLevel) => patch({ motivationLevel })}
        />
      </View>
    </OnboardingShell>
  );
}

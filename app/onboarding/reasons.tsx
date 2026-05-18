import { router } from "expo-router";
import { View } from "react-native";

import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ReasonsPickStep } from "@/components/feature/onboarding/ReasonsPickStep";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboardingFlow";
import { QUIT_REASON_OPTIONS } from "@/constants/onboardingReasons";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Reasons() {
  const { draft, patch } = useOnboarding();
  const quitReasonIds = draft.quitReasonIds ?? [];

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
      title="My reasons for quitting smoking"
      subtitle="Pick what matters most to you. You can choose more than one."
      primaryLabel="Continue"
      primaryDisabled={!canContinue}
      onPrimary={() => router.push("/onboarding/motivation")}
      showBack={false}
    >
      <View className="w-full">
        <ReasonsPickStep
          options={QUIT_REASON_OPTIONS}
          selectedIds={quitReasonIds}
          onToggle={toggle}
        />
      </View>
    </OnboardingShell>
  );
}

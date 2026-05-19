import { safeRouter } from "@/utils/safeRouter";
import { View } from "react-native";

import { InterestPickStep } from "@/components/feature/onboarding/InterestPickStep";
import { OnboardingShell } from "@/components/feature/onboarding/OnboardingShell";
import { ONBOARDING_TOTAL_STEPS } from "@/constants/onboardingFlow";
import type { PrimaryInterestId } from "@/types";
import { useOnboarding } from "@/context/OnboardingContext";

export default function Interests() {
  const { draft, patch } = useOnboarding();
  const selectedIds = draft.primaryInterestIds ?? [];

  const toggle = (id: PrimaryInterestId) => {
    const has = selectedIds.includes(id);
    patch({
      primaryInterestIds: has
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    });
  };

  const canContinue = selectedIds.length > 0;

  return (
    <OnboardingShell
      step={4}
      total={ONBOARDING_TOTAL_STEPS}
      title="What interests you the most?"
      primaryLabel="Continue"
      primaryDisabled={!canContinue}
      onPrimary={() => safeRouter.push("/onboarding/create-profile")}
      showBack
      scrollBody
    >
      <View className="w-full min-h-0 flex-1">
        <InterestPickStep selectedIds={selectedIds} onToggle={toggle} />
      </View>
    </OnboardingShell>
  );
}

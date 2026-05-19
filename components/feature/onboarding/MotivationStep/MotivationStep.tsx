import { OnboardingChipGroup } from "@/components/feature/onboarding/shared/OnboardingChipGroup";
import { MOTIVATION_LEVEL_OPTIONS } from "@/constants/onboardingMotivation";
import type { MotivationLevel } from "@/types/onboarding";

type Props = {
  selected?: MotivationLevel;
  onSelect: (level: MotivationLevel) => void;
};

export function MotivationStep({ selected, onSelect }: Props) {
  return (
    <OnboardingChipGroup
      options={MOTIVATION_LEVEL_OPTIONS}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

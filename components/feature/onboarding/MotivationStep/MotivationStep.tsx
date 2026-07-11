import { useMemo } from "react";

import { OnboardingChipGroup } from "@/components/feature/onboarding/shared/OnboardingChipGroup";
import { MOTIVATION_LEVEL_OPTIONS } from "@/constants/onboarding/onboardingMotivation";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import type { MotivationLevel } from "@/types/onboarding/onboarding";

type Props = {
  selected?: MotivationLevel;
  onSelect: (level: MotivationLevel) => void;
};

export function MotivationStep({ selected, onSelect }: Props) {
  const { localize } = useLocalizedCatalog();
  const options = useMemo(
    () => localize(MOTIVATION_LEVEL_OPTIONS, "onboarding.motivation", ["label"]),
    [localize],
  );

  return (
    <OnboardingChipGroup
      options={options}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

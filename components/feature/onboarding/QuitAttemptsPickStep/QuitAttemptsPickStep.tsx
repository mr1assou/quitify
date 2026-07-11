import { useMemo } from "react";
import { View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import {
  PRIOR_QUIT_ATTEMPT_OPTIONS,
  type PriorQuitAttempts,
} from "@/constants/onboarding/onboardingPriorQuitAttempts";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";

type Props = {
  selected?: PriorQuitAttempts;
  onSelect: (value: PriorQuitAttempts) => void;
};

export function QuitAttemptsPickStep({ selected, onSelect }: Props) {
  const { localize } = useLocalizedCatalog();
  const options = useMemo(
    () => localize(PRIOR_QUIT_ATTEMPT_OPTIONS, "onboarding.quitAttempts", ["label"]),
    [localize],
  );

  return (
    <View className="w-full gap-3">
      {options.map((opt) => (
        <Chip
          key={opt.id}
          label={opt.label}
          size="lg"
          fullWidth
          selected={selected === opt.id}
          onPress={() => onSelect(opt.id)}
        />
      ))}
    </View>
  );
}

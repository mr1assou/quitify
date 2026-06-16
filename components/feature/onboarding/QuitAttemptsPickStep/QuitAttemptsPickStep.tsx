import { View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import {
  PRIOR_QUIT_ATTEMPT_OPTIONS,
  type PriorQuitAttempts,
} from "@/constants/onboarding/onboardingPriorQuitAttempts";

type Props = {
  selected?: PriorQuitAttempts;
  onSelect: (value: PriorQuitAttempts) => void;
};

export function QuitAttemptsPickStep({ selected, onSelect }: Props) {
  return (
    <View className="w-full gap-3">
      {PRIOR_QUIT_ATTEMPT_OPTIONS.map((opt) => (
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

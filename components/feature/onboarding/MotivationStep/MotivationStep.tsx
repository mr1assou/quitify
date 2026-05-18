import { View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import {
  MOTIVATION_LEVEL_OPTIONS,
  type MotivationLevel,
} from "@/constants/onboardingMotivation";

type Props = {
  selected?: MotivationLevel;
  onSelect: (level: MotivationLevel) => void;
};

export function MotivationStep({ selected, onSelect }: Props) {
  return (
    <View className="w-full gap-3">
      {MOTIVATION_LEVEL_OPTIONS.map((opt) => (
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

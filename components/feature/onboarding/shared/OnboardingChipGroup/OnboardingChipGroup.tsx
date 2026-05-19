import { Text, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";

type Option<T extends string> = {
  id: T;
  label: string;
  hint?: string;
};

type Props<T extends string> = {
  /** Omit when the screen title already states the question. */
  label?: string;
  options: readonly Option<T>[];
  selected?: T;
  onSelect: (id: T) => void;
  /** When false, hides hint under chips (e.g. custom date section). */
  showSelectedHint?: boolean;
};

export function OnboardingChipGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
  showSelectedHint = true,
}: Props<T>) {
  const active = options.find((o) => o.id === selected);

  return (
    <View className="gap-2">
      {label ? <OnboardingFieldLabel>{label}</OnboardingFieldLabel> : null}
      <View className="gap-3">
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
      {showSelectedHint && active?.hint ? (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          {active.hint}
        </Text>
      ) : null}
    </View>
  );
}

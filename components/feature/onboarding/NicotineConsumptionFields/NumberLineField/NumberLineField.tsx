import { Text, TextInput, View } from "react-native";

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  label: string;
  keyboardType: "decimal-pad" | "number-pad";
  value?: number;
  treatZeroAsEmpty?: boolean;
  onRawChangeText: (raw: string) => void;
};

export function NumberLineField({
  label,
  keyboardType,
  value,
  treatZeroAsEmpty,
  onRawChangeText,
}: Props) {
  const { colors } = useTheme();
  const hide = value === undefined || (treatZeroAsEmpty && value === 0);
  const display = hide ? "" : String(value);

  return (
    <View className="gap-1.5">
      <OnboardingFieldLabel>{label}</OnboardingFieldLabel>
      <TextInput
        value={display}
        onChangeText={onRawChangeText}
        placeholder="—"
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
      />
    </View>
  );
}

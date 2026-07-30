import { Platform, TextInput, View } from "react-native";

import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  value?: string;
  onChangeText: (raw: string) => void;
  hasError?: boolean;
  placeholder?: string;
};

const KEYBOARD = Platform.OS === "android" ? "number-pad" : ("number-pad" as const);

export function CigarettesPerPackField({
  value,
  onChangeText,
  hasError,
  placeholder = "Enter a number",
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      className={`rounded-2xl bg-section dark:bg-d-surface border-2 ${hasError ? "border-alert" : "border-transparent"}`}
      style={{ minHeight: ONBOARDING_CONTROL_HEIGHT }}
    >
      <TextInput
        value={value ?? ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={KEYBOARD}
        maxLength={3}
        className="px-4 py-3 text-base text-foreground dark:text-d-text"
      />
    </View>
  );
}

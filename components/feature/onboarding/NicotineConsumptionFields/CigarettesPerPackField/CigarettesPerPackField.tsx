import { Platform, TextInput, View } from "react-native";

import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboardingFlow";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  value?: string;
  onChangeText: (raw: string) => void;
  hasError?: boolean;
};

const KEYBOARD = Platform.OS === "android" ? "number-pad" : ("number-pad" as const);

export function CigarettesPerPackField({ value, onChangeText, hasError }: Props) {
  const { colors } = useTheme();

  return (
    <View
      className={`overflow-hidden rounded-2xl bg-section dark:bg-d-surface${hasError ? " border-2 border-alert" : ""}`}
      style={{ minHeight: ONBOARDING_CONTROL_HEIGHT }}
    >
      <TextInput
        value={value ?? ""}
        onChangeText={onChangeText}
        placeholder="e.g. 20"
        placeholderTextColor={colors.mutedForeground}
        keyboardType={KEYBOARD}
        maxLength={3}
        className="px-4 py-3 text-base text-foreground dark:text-d-text"
      />
    </View>
  );
}

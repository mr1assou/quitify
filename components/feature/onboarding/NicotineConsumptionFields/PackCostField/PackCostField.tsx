import { Platform, Text, TextInput, View } from "react-native";

import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import { useTheme } from "@/context/ThemeContext";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  currency: string;
  value?: string;
  onChangeText: (raw: string) => void;
  hasError?: boolean;
  placeholder?: string;
};

const KEYBOARD =
  Platform.OS === "android" ? "number-pad" : ("decimal-pad" as const);

export function PackCostField({
  currency,
  value,
  onChangeText,
  hasError,
  placeholder = "Enter a price",
}: Props) {
  const { colors } = useTheme();
  const symbol = currencySymbol(currency);
  const showSymbol = symbol.trim().length > 0 && symbol.trim() !== currency;

  return (
    <View
      className={`flex-row items-center rounded-2xl bg-section dark:bg-d-surface border-2 ${hasError ? "border-alert" : "border-transparent"}`}
      style={{ minHeight: ONBOARDING_CONTROL_HEIGHT }}
    >
      <View className="items-center justify-center border-r border-border px-4 dark:border-d-border">
        <Text className="text-base font-semibold text-foreground dark:text-d-text">
          {showSymbol ? symbol.trim() : currency}
        </Text>
      </View>
      <TextInput
        value={value ?? ""}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={KEYBOARD}
        className="min-w-0 flex-1 px-4 py-3 text-base text-foreground dark:text-d-text"
      />
    </View>
  );
}

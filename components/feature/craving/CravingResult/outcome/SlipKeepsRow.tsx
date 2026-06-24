import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  leading: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
};

export function SlipKeepsRow({ leading, label, value, valueColor }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center">
      {leading}
      <Text className="ml-3 flex-1 text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
      <Text
        className="text-sm font-bold"
        style={{ color: valueColor ?? colors.primary }}
      >
        {value}
      </Text>
    </View>
  );
}

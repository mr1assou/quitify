import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  label: string;
  value: string;
  valueTone?: "default" | "alert";
};

export function SlipKeepsRow({
  icon,
  tint,
  label,
  value,
  valueTone = "default",
}: Props) {
  const { colors } = useTheme();
  const valueColor = valueTone === "alert" ? colors.alert : colors.primary;

  return (
    <View className="flex-row items-center">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${tint}22` }}
      >
        <Ionicons name={icon} size={16} color={tint} />
      </View>
      <Text className="ml-3 flex-1 text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
      <Text className="text-sm font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}

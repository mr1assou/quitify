import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  title?: string;
  variant?: "close" | "back";
  onClose: () => void;
};

export function ProfileScreenHeader({
  title = "Profile",
  variant = "back",
  onClose,
}: Props) {
  const { colors } = useTheme();
  const icon = variant === "close" ? "close" : "chevron-back";

  return (
    <View className="flex-row items-center justify-between px-4 pt-2">
      <Pressable
        onPress={onClose}
        className="h-11 w-11 items-center justify-center rounded-full bg-section active:opacity-70 dark:bg-d-surface"
        accessibilityLabel={variant === "close" ? "Close profile" : "Go back"}
      >
        <Ionicons name={icon} size={22} color={colors.foreground} />
      </Pressable>
      <Text className="text-base font-bold text-foreground dark:text-d-text">{title}</Text>
      <View className="h-11 w-11" />
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  iconColor?: string;
  className?: string;
  badge?: number;
};

export function HeaderIconButton({
  icon,
  onPress,
  accessibilityLabel,
  iconColor,
  className = "bg-section dark:bg-d-surface",
  badge,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={`relative h-11 w-11 items-center justify-center rounded-full active:opacity-80 ${className}`}
    >
      <Ionicons name={icon} size={22} color={iconColor ?? colors.foreground} />
      {badge != null && badge > 0 ? (
        <View
          className="absolute -right-0.5 -top-0.5 min-h-[16px] min-w-[16px] items-center justify-center rounded-full px-1"
          style={{ backgroundColor: colors.alert }}
        >
          <Text className="text-[10px] font-bold leading-none text-white">
            {badge > 9 ? "9+" : badge}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

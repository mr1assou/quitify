import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  onPress: () => void;
  className?: string;
  /** When true, chip is nested under the body editor (no outer horizontal margin). */
  embedded?: boolean;
};

export function PostAddPhotosChip({ onPress, className, embedded = false }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className={`self-start flex-row items-center rounded-full border border-section px-4 py-2 dark:border-d-border ${
        embedded ? "" : "mx-5"
      } ${className ?? ""}`}
    >
      <Ionicons name="add" size={16} color={colors.mutedForeground} />
      <Text className="ml-1.5 text-sm font-semibold" style={{ color: colors.mutedForeground }}>
        Add photo
      </Text>
    </Pressable>
  );
}

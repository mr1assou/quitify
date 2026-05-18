import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onClose: () => void;
};

export function CravingSessionHeader({ title, showBack = false, onBack, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center px-4 pt-2">
      {showBack && onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={colors.foreground} />
        </Pressable>
      ) : (
        <View className="h-10 w-10" />
      )}

      <View className="flex-1 items-center justify-center px-2">
        {title ? (
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {title}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onClose}
        className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
        accessibilityLabel="Close"
      >
        <Ionicons name="close" size={22} color={colors.foreground} />
      </Pressable>
    </View>
  );
}

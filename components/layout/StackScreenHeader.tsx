import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
};

export function StackScreenHeader({ title, onBack, rightAction }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Pressable onPress={onBack ?? (() => router.back())} hitSlop={8}>
        <Ionicons name="chevron-back" size={26} color={colors.foreground} />
      </Pressable>
      <Text className="text-base font-bold text-foreground dark:text-d-text">{title}</Text>
      {rightAction ?? <View className="w-[26px]" />}
    </View>
  );
}

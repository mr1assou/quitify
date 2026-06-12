import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

export function PostComposerHeader() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-3 px-5 pb-2 pt-3">
      <Pressable onPress={() => router.back()} hitSlop={8} accessibilityLabel="Close">
        <Ionicons name="close" size={24} color={colors.foreground} />
      </Pressable>
      <Text className="text-xl font-bold text-foreground dark:text-d-text">Create post</Text>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

export default function Privacy() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <View className="flex-row items-center justify-between px-4 pt-2">
        <View className="w-10" />
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Privacy
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
        >
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text className="text-2xl font-bold text-foreground dark:text-d-text">
          Privacy policy
        </Text>
        <Text className="mt-4 text-base leading-6 text-muted-foreground dark:text-d-muted">
          This is a placeholder. Replace with your final legal text before release.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

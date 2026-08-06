import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function Terms() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-between px-4 pt-2">
        <View className="w-10" />
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {t("legal.termsShort")}
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
          {t("legal.termsTitle")}
        </Text>
        <Text className="mt-4 text-base leading-6 text-muted-foreground dark:text-d-muted">
          {t("legal.placeholder")}
        </Text>
      </ScrollView>
    </ScreenCanvas>
  );
}

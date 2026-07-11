import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { LanguagePickerSheet } from "@/components/i18n/LanguagePickerSheet";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export function LanguageToggleButton() {
  const { colors } = useTheme();
  const { language, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const scale = useSharedValue(1);

  const onPress = () => {
    Haptics.selectionAsync().catch(() => {});
    scale.value = withSequence(
      withTiming(0.92, { duration: 90 }),
      withTiming(1, { duration: 180, easing: Easing.out(Easing.back(1.4)) }),
    );
    setOpen(true);
  };

  const iconAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t("language.a11yOpen", { language: language.nativeName })}
        hitSlop={10}
        className="h-11 min-w-11 flex-row items-center justify-center gap-1 rounded-full border border-border bg-section px-3 active:opacity-80 dark:border-d-border dark:bg-d-surface"
      >
        <Animated.View style={iconAnim} className="flex-row items-center gap-1.5">
          <Ionicons name="language" size={18} color={colors.foreground} />
          <Text className="text-xs font-bold text-foreground dark:text-d-text">
            {language.shortLabel}
          </Text>
        </Animated.View>
      </Pressable>

      <LanguagePickerSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { LANGUAGES } from "@/constants/i18n/languages";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AppLocale } from "@/types/i18n/locale";

function nextLocale(current: AppLocale): AppLocale {
  const idx = LANGUAGES.findIndex((l) => l.id === current);
  const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
  return next?.id ?? "en";
}

export function LanguageToggleButton() {
  const { colors } = useTheme();
  const { locale, setLocale, t, language } = useTranslation();

  const onPress = () => {
    Haptics.selectionAsync().catch(() => {});
    setLocale(nextLocale(locale));
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("language.a11yOpen", { language: language.nativeName })}
      hitSlop={12}
      className="items-center justify-center active:opacity-70"
    >
      <View className="items-center justify-center">
        <Ionicons name="language" size={18} color={colors.foreground} />
        <Text className="mt-0.5 text-[9px] font-bold text-foreground dark:text-d-text">
          {language.shortLabel}
        </Text>
      </View>
    </Pressable>
  );
}

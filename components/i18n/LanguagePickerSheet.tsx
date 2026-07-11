import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LANGUAGES } from "@/constants/i18n/languages";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AppLocale } from "@/types/i18n/locale";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function LanguagePickerSheet({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();

  const choose = (next: AppLocale) => {
    if (next === locale) {
      onClose();
      return;
    }
    Haptics.selectionAsync().catch(() => {});
    setLocale(next);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          onPress={() => {}}
          className="rounded-t-3xl border border-border bg-section px-4 pt-4 dark:border-d-border dark:bg-d-surface"
          style={{
            paddingBottom: Math.max(insets.bottom, 16),
            maxHeight: Math.min(winH * 0.7, 420),
          }}
        >
          <View className="mb-4 h-1 w-10 self-center rounded-full bg-border dark:bg-d-border" />
          <Text className="mb-4 text-center text-lg font-bold text-foreground dark:text-d-text">
            {t("language.pickTitle")}
          </Text>

          <View className="gap-2">
            {LANGUAGES.map((lang) => {
              const active = locale === lang.id;
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => choose(lang.id)}
                  className={[
                    "flex-row items-center justify-between rounded-2xl border px-4 py-3.5",
                    active
                      ? "border-accent bg-accent-soft dark:bg-d-accent-soft"
                      : "border-border bg-elevated dark:border-d-border dark:bg-d-elevated",
                  ].join(" ")}
                >
                  <View className="flex-row items-center gap-3">
                    <Text className="text-xs font-bold text-muted-foreground dark:text-d-muted">
                      {lang.shortLabel}
                    </Text>
                    <Text
                      className={[
                        "text-base font-semibold",
                        active
                          ? "text-accent"
                          : "text-foreground dark:text-d-text",
                      ].join(" ")}
                    >
                      {lang.nativeName}
                    </Text>
                  </View>
                  {active ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

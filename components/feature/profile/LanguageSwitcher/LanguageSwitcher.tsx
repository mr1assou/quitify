import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ListGroup } from "@/components/ui/ListGroup";
import { LANGUAGES } from "@/constants/i18n/languages";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AppLocale } from "@/types/i18n/locale";

export function LanguageSwitcher() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { locale, setLocale, t, language } = useTranslation();
  const [open, setOpen] = useState(false);

  const choose = (next: AppLocale) => {
    if (next !== locale) setLocale(next);
    setOpen(false);
  };

  return (
    <>
      <ListGroup
        rows={[
          {
            id: "language",
            icon: "language",
            label: t("settings.language"),
            value: language.nativeName,
            onPress: () => {
              setOpen(true);
            },
          },
        ]}
      />

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            className="absolute inset-0 bg-black/45"
            onPress={() => setOpen(false)}
          />

          <View
            className="overflow-hidden rounded-t-3xl bg-background px-4 pt-3 dark:bg-d-bg"
            style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
          >
            <View className="mb-3 items-center">
              <View className="h-1 w-10 rounded-full bg-border dark:bg-d-border" />
            </View>

            <Text className="mb-3 px-2 text-base font-bold text-foreground dark:text-d-text">
              {t("language.pickTitle")}
            </Text>

            <View className="overflow-hidden rounded-2xl bg-section dark:bg-d-surface">
              {LANGUAGES.map((lang, index) => {
                const selected = locale === lang.id;
                return (
                  <View key={lang.id}>
                    {index > 0 ? (
                      <View className="ml-4 h-px bg-border/40 dark:bg-d-border" />
                    ) : null}
                    <Pressable
                      onPress={() => choose(lang.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      className="flex-row items-center px-4 py-4 active:opacity-80"
                    >
                      <Text className="flex-1 text-base font-medium text-foreground dark:text-d-text">
                        {lang.nativeName}
                      </Text>
                      {selected ? (
                        <Ionicons name="checkmark" size={20} color={colors.primary} />
                      ) : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

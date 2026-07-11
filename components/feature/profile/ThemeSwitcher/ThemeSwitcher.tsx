import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { BRAND_ORANGE, darkColors, lightColors } from "@/constants/app/theme";
import { type ThemePreference, useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const PREVIEW = {
  light: {
    bg: lightColors.background,
    card: lightColors.section,
    accent: BRAND_ORANGE,
    dot: lightColors.foreground,
  },
  dark: {
    bg: darkColors.background,
    card: darkColors.section,
    accent: BRAND_ORANGE,
    dot: darkColors.foreground,
  },
  system: {
    bg: lightColors.background,
    card: darkColors.background,
    accent: BRAND_ORANGE,
    dot: lightColors.foreground,
  },
} as const;

const ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  light: "sunny",
  dark: "moon",
  system: "phone-portrait",
};

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  const { t } = useTranslation();

  const options: {
    id: ThemePreference;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    preview: (typeof PREVIEW)[ThemePreference];
  }[] = [
    { id: "light", label: t("theme.light"), icon: ICONS.light, preview: PREVIEW.light },
    { id: "dark", label: t("theme.dark"), icon: ICONS.dark, preview: PREVIEW.dark },
    { id: "system", label: t("theme.auto"), icon: ICONS.system, preview: PREVIEW.system },
  ];

  const choose = (p: ThemePreference) => {
    if (p === preference) return;
    Haptics.selectionAsync().catch(() => {});
    setPreference(p);
  };

  return (
    <Card variant="section">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {t("settings.appearance")}
      </Text>
      <Text className="mt-1 text-base font-bold text-foreground dark:text-d-text">
        {t("settings.theme")}
      </Text>

      <View className="mt-4 flex-row gap-3">
        {options.map((opt) => (
          <ThemeOption
            key={opt.id}
            active={preference === opt.id}
            onPress={() => choose(opt.id)}
            label={opt.label}
            icon={opt.icon}
            preview={opt.preview}
            splitPreview={opt.id === "system"}
          />
        ))}
      </View>
    </Card>
  );
}

type OptionProps = {
  active: boolean;
  onPress: () => void;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  preview: { bg: string; card: string; accent: string; dot: string };
  splitPreview: boolean;
};

function ThemeOption({ active, onPress, label, icon, preview, splitPreview }: OptionProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(18)}
      style={[{ flex: 1 }, style]}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 18, stiffness: 280 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        onPress={onPress}
        className={[
          "items-center gap-2 rounded-2xl border px-2 py-3",
          active
            ? "border-accent bg-accent-soft dark:bg-d-accent-soft"
            : "border-border bg-elevated dark:border-d-border dark:bg-d-elevated",
        ].join(" ")}
      >
        <View
          style={{ backgroundColor: preview.bg }}
          className="h-12 w-full overflow-hidden rounded-xl"
        >
          {splitPreview ? (
            <View className="h-full w-full flex-row">
              <View style={{ flex: 1, backgroundColor: lightColors.section }} />
              <View style={{ flex: 1, backgroundColor: darkColors.background }} />
            </View>
          ) : (
            <View className="h-full w-full p-1.5">
              <View
                style={{ backgroundColor: preview.card }}
                className="h-3 w-3/4 rounded-full"
              />
              <View className="mt-1 flex-row items-center gap-1">
                <View
                  style={{ backgroundColor: preview.accent }}
                  className="h-2 w-2 rounded-full"
                />
                <View
                  style={{ backgroundColor: preview.dot }}
                  className="h-1.5 w-6 rounded-full"
                />
              </View>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-1">
          <Ionicons
            name={icon}
            size={14}
            color={active ? BRAND_ORANGE : undefined}
          />
          <Text
            className={[
              "text-xs font-semibold",
              active
                ? "text-accent"
                : "text-foreground dark:text-d-text",
            ].join(" ")}
          >
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

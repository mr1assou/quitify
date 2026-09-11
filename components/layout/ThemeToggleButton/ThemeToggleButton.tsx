import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { ThemePreference } from "@/types";

const ORDER: readonly ThemePreference[] = ["light", "dark", "system"] as const;

const ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  light: "sunny",
  dark: "moon",
  system: "phone-portrait",
};

function nextPreference(current: ThemePreference): ThemePreference {
  const idx = ORDER.indexOf(current);
  return ORDER[(idx + 1) % ORDER.length];
}

export function ThemeToggleButton() {
  const { preference, setPreference, colors } = useTheme();
  const { t } = useTranslation();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const a11yLabel =
    preference === "light"
      ? t("theme.a11yLight")
      : preference === "dark"
        ? t("theme.a11yDark")
        : t("theme.a11ySystem");

  const onPress = () => {
    rotate.value = withSequence(
      withTiming(0.5, { duration: 280, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 0 }),
    );
    scale.value = withSequence(
      withTiming(0.92, { duration: 90 }),
      withTiming(1, { duration: 180, easing: Easing.out(Easing.back(1.4)) }),
    );
    setPreference(nextPreference(preference));
  };

  const iconAnim = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value * 180}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      hitSlop={10}
      className="h-11 w-11 items-center justify-center rounded-full border border-border bg-section active:opacity-80 dark:border-d-border dark:bg-d-surface"
    >
      <Animated.View style={iconAnim}>
        <Ionicons name={ICONS[preference]} size={20} color={colors.foreground} />
      </Animated.View>

      {preference === "system" ? (
        <View
          pointerEvents="none"
          style={{ backgroundColor: colors.accent }}
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
        />
      ) : null}
    </Pressable>
  );
}

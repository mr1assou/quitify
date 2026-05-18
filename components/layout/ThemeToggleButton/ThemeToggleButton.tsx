import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { ThemePreference } from "@/types";

const ORDER: readonly ThemePreference[] = ["light", "dark", "system"] as const;

const ICONS: Record<ThemePreference, keyof typeof Ionicons.glyphMap> = {
  light: "sunny",
  dark: "moon",
  system: "phone-portrait",
};

const A11Y_LABEL: Record<ThemePreference, string> = {
  light: "Theme: light. Tap to switch to dark.",
  dark: "Theme: dark. Tap to switch to system.",
  system: "Theme: system. Tap to switch to light.",
};

function nextPreference(current: ThemePreference): ThemePreference {
  const idx = ORDER.indexOf(current);
  return ORDER[(idx + 1) % ORDER.length];
}

export function ThemeToggleButton() {
  const { preference, setPreference, colors } = useTheme();
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const onPress = () => {
    Haptics.selectionAsync().catch(() => {});
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
      accessibilityLabel={A11Y_LABEL[preference]}
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

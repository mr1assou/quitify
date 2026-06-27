import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Switch, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { BRAND_ORANGE } from "@/constants/app/theme";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  enabled: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

export function PushNotificationsToggle({
  enabled,
  disabled = false,
  onValueChange,
}: Props) {
  const { colors, resolved } = useTheme();
  const isDark = resolved === "dark";
  const progress = useSharedValue(enabled ? 1 : 0);
  const busy = useSharedValue(disabled ? 1 : 0);

  const iconBgOff = isDark ? "#252018" : "#FFFFFF";
  const iconBgOn = isDark ? "#2E2218" : "#FFF0E0";
  const cardBorderOff = "transparent";
  const cardBorderOn = isDark ? "rgba(255, 122, 0, 0.35)" : "rgba(255, 122, 0, 0.22)";

  useEffect(() => {
    progress.value = withSpring(enabled ? 1 : 0, {
      damping: 16,
      stiffness: 180,
      mass: 0.8,
    });
  }, [enabled, progress]);

  useEffect(() => {
    busy.value = withSpring(disabled ? 1 : 0, { damping: 20, stiffness: 200 });
  }, [busy, disabled]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [cardBorderOff, cardBorderOn]),
    borderWidth: 1,
    opacity: 1 - busy.value * 0.35,
    transform: [{ scale: 1 - busy.value * 0.01 }],
  }));

  const iconWrapStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [iconBgOff, iconBgOn]),
    transform: [{ scale: 0.94 + progress.value * 0.06 }],
  }));

  const handleChange = (value: boolean) => {
    Haptics.selectionAsync().catch(() => {});
    onValueChange(value);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(480).springify().damping(18).stiffness(140)}
      layout={LinearTransition.springify().damping(18)}
      style={cardStyle}
      className="overflow-hidden rounded-3xl bg-section dark:bg-d-surface"
    >
      <View className="flex-row items-center px-4 py-4">
        <Animated.View
          style={iconWrapStyle}
          className="h-9 w-9 items-center justify-center rounded-full"
        >
          <Ionicons
            name={enabled ? "notifications" : "notifications-outline"}
            size={18}
            color={enabled ? BRAND_ORANGE : colors.primary}
          />
        </Animated.View>

        <View className="ml-3 flex-1 pr-3">
          <Text className="text-base font-medium text-foreground dark:text-d-text">
            Receive notifications from Quitify
          </Text>
        </View>

        <Switch
          value={enabled}
          disabled={disabled}
          onValueChange={handleChange}
          trackColor={{ false: colors.muted, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
    </Animated.View>
  );
}

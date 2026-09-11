import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { missionPlanLabel } from "@/constants/progress/plan";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CURRENT_SIZE = 64;
const HALO_SIZE = 76;

type Props = {
  day: number;
  onPress: () => void;
};

/** Current day on the plan map — same pulsing primary style as craving CTAs. */
export function MissionMapCurrentNode({ day, onPress }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const press = useSharedValue(1);
  const halo = useSharedValue(0);

  useEffect(() => {
    halo.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [halo]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - halo.value),
    transform: [{ scale: 1 + halo.value * 0.45 }],
  }));

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  return (
    <View className="items-center">
      <View
        className="relative items-center justify-center"
        style={{ width: HALO_SIZE, height: HALO_SIZE }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            haloStyle,
            {
              position: "absolute",
              width: HALO_SIZE,
              height: HALO_SIZE,
              borderRadius: HALO_SIZE / 2,
              backgroundColor: colors.primary,
            },
          ]}
        />
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={missionPlanLabel(day, t)}
          accessibilityState={{ selected: true }}
          onPressIn={() => {
            press.value = withSpring(0.94, { damping: 18, stiffness: 280 });
          }}
          onPressOut={() => {
            press.value = withSpring(1, { damping: 14, stiffness: 220 });
          }}
          onPress={onPress}
          style={[
            pressStyle,
            {
              width: CURRENT_SIZE,
              height: CURRENT_SIZE,
              borderRadius: CURRENT_SIZE / 2,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text className="text-xl font-bold text-white">{day}</Text>
        </AnimatedPressable>
      </View>
      <Text
        numberOfLines={2}
        className="mt-1.5 max-w-[132px] text-center text-[10px] font-bold leading-3 text-foreground dark:text-d-text"
      >
        {missionPlanLabel(day, t)}
      </Text>
    </View>
  );
}

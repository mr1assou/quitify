import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  /** Target scale (0–1) the circle should ease toward. */
  targetScale: number;
  /** Duration of the current phase in ms. */
  durationMs: number;
  size?: number;
};

/**
 * A serene breathing orb that smoothly scales between phases.
 * Pure visual — driven entirely by props.
 */
export function BreathingCircle({ targetScale, durationMs, size = 260 }: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(targetScale);
  const glow = useSharedValue(targetScale);

  useEffect(() => {
    const easing = Easing.inOut(Easing.quad);
    scale.value = withTiming(targetScale, { duration: durationMs, easing });
    glow.value = withTiming(targetScale, { duration: durationMs, easing });
  }, [targetScale, durationMs, scale, glow]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.85 + glow.value * 0.25 }],
    opacity: 0.35 + glow.value * 0.25,
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.accentSoft,
          },
          haloStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: (size * 0.78) / 2,
            backgroundColor: colors.accent,
            shadowColor: colors.accent,
            shadowOpacity: 0.35,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 6,
          },
          orbStyle,
        ]}
      />
    </View>
  );
}

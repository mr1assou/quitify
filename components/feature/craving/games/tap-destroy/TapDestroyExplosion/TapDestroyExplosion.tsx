import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

const PARTICLE_COUNT = 8;

type Props = {
  size: number;
  onComplete?: () => void;
};

export function TapDestroyExplosion({ size, onComplete }: Props) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 420, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished && onComplete) runOnJS(onComplete)();
      },
    );
  }, [onComplete, progress]);

  return (
    <View
      pointerEvents="none"
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ExplosionGlow progress={progress} size={size} color={colors.accentSoft} />
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <ExplosionParticle
          key={index}
          index={index}
          progress={progress}
          color={colors.accent}
        />
      ))}
    </View>
  );
}

function ExplosionGlow({
  progress,
  size,
  color,
}: {
  progress: SharedValue<number>;
  size: number;
  color: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 0.4 + progress.value * 1.6 }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: size,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function ExplosionParticle({
  index,
  progress,
  color,
}: {
  index: number;
  progress: SharedValue<number>;
  color: string;
}) {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 26 + (index % 3) * 8;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: 1 - p,
      transform: [
        { translateX: Math.cos(angle) * distance * p },
        { translateY: Math.sin(angle) * distance * p },
        { scale: 1 - p * 0.6 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

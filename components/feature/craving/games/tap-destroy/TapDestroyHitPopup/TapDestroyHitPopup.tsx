import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  x: number;
  y: number;
  scoreGain: number;
  combo: number;
  onDone: (id: string) => void;
  id: string;
};

export function TapDestroyHitPopup({
  x,
  y,
  scoreGain,
  combo,
  onDone,
  id,
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 720, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) runOnJS(onDone)(id);
      },
    );
  }, [id, onDone, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: -36 * progress.value },
      { scale: 1 + progress.value * 0.15 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: x - 40,
          top: y - 28,
          width: 80,
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text className="font-mono text-lg font-bold text-accent">+{scoreGain}</Text>
      {combo >= 2 ? (
        <Text className="text-xs font-bold uppercase tracking-wide text-accent">
          x{combo} combo
        </Text>
      ) : null}
    </Animated.View>
  );
}

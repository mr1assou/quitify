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
  id: string;
  x: number;
  y: number;
  combo: number;
  onDone: (id: string) => void;
};

export function NinjaSliceBurst({ id, x, y, combo, onDone }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: 480, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onDone)(id);
      },
    );
  }, [id, onDone, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ scale: 0.6 + progress.value * 1.4 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          left: x - 28,
          top: y - 28,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "rgba(255, 140, 80, 0.35)",
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {combo >= 2 ? (
        <Text className="text-xs font-bold text-accent">x{combo}</Text>
      ) : null}
    </Animated.View>
  );
}

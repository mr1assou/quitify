import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  /** 0..1 */
  progress: number;
  height?: number;
  trackClassName?: string;
  fillClassName?: string;
};

export function ProgressBar({
  progress,
  height = 8,
  trackClassName = "bg-border dark:bg-d-elevated",
  fillClassName = "bg-primary",
}: Props) {
  const v = useSharedValue(progress);

  useEffect(() => {
    v.value = withTiming(Math.min(1, Math.max(0, progress)), { duration: 600 });
  }, [progress, v]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${v.value * 100}%`,
  }));

  return (
    <View className={`w-full overflow-hidden rounded-full ${trackClassName}`} style={{ height }}>
      <Animated.View className={`h-full rounded-full ${fillClassName}`} style={animatedStyle} />
    </View>
  );
}

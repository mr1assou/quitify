import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ProgressBar } from "@/components/ui/ProgressBar";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  target?: number;
  onComplete?: () => void;
};

export function TapGame({ target = 20, onComplete }: Props) {
  const [taps, setTaps] = useState(0);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onTap = () => {
    scale.value = withSpring(0.9, { damping: 14, stiffness: 320 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 240 });
    }, 80);
    setTaps((t) => {
      const n = t + 1;
      if (n >= target) {
        onComplete?.();
      }
      return n;
    });
  };

  const done = taps >= target;
  const progress = Math.min(1, taps / target);

  return (
    <View className="items-center">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Mini focus
      </Text>
      <Text className="mt-1 text-center text-sm text-foreground dark:text-d-text">
        Tap the dot {target} times. Cravings hate distraction.
      </Text>

      <AnimatedPressable
        onPress={onTap}
        style={animatedStyle}
        className={`mt-5 h-24 w-24 items-center justify-center rounded-full ${
          done ? "bg-accent" : "bg-primary"
        } active:opacity-90`}
      >
        <Text className="text-2xl font-bold text-white">{Math.min(taps, target)}</Text>
      </AnimatedPressable>

      <View className="mt-5 w-full px-4">
        <ProgressBar
          progress={progress}
          fillClassName={done ? "bg-accent" : "bg-primary"}
        />
        <Text className="mt-2 text-center text-xs text-muted-foreground dark:text-d-muted">
          {done ? "Nice — keep breathing" : `${target - taps} taps to go`}
        </Text>
      </View>
    </View>
  );
}

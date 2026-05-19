import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  secondsLeft: number;
  totalSeconds: number;
  score: number;
  linesCleared: number;
  combo: number;
};

export function PuzzleHud({
  secondsLeft,
  totalSeconds,
  score,
  linesCleared,
  combo,
}: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  const comboScale = useSharedValue(1);
  useEffect(() => {
    if (combo < 2) return;
    comboScale.value = withSequence(
      withSpring(1.25, { damping: 8, stiffness: 220 }),
      withTiming(1, { duration: 220 }),
    );
  }, [combo, comboScale]);

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timeLabel = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Time
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {timeLabel}
          </Text>
        </View>

        <View className="items-center">
          {combo >= 2 ? (
            <Animated.View style={comboStyle} className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-accent">
                Combo
              </Text>
              <Text className="font-mono text-2xl font-bold tabular-nums text-accent">
                x{combo}
              </Text>
            </Animated.View>
          ) : (
            <View className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Lines
              </Text>
              <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
                {linesCleared}
              </Text>
            </View>
          )}
        </View>

        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Score
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {score}
          </Text>
        </View>
      </View>
      <View className="mt-3">
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
}

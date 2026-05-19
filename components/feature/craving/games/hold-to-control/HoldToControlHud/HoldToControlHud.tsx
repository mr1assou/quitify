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
  roundIndex: number;
  totalWaves: number;
  holdProgress: number;
  score: number;
  streak: number;
};

export function HoldToControlHud({
  roundIndex,
  totalWaves,
  holdProgress,
  score,
  streak,
}: Props) {
  const sessionProgress =
    totalWaves > 0
      ? (roundIndex + holdProgress) / totalWaves
      : 0;

  const streakScale = useSharedValue(1);
  useEffect(() => {
    if (streak < 2) return;
    streakScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 220 }),
      withTiming(1, { duration: 220 }),
    );
  }, [streak, streakScale]);

  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Wave
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {Math.min(roundIndex + 1, totalWaves)}/{totalWaves}
          </Text>
        </View>

        <View className="items-center">
          {streak >= 2 ? (
            <Animated.View style={streakStyle} className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-accent">
                Streak
              </Text>
              <Text className="font-mono text-2xl font-bold tabular-nums text-accent">
                x{streak}
              </Text>
            </Animated.View>
          ) : (
            <View className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Hold
              </Text>
              <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
                {Math.round(holdProgress * 100)}%
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
        <ProgressBar progress={sessionProgress} />
      </View>
    </View>
  );
}

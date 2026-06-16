import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  score: number;
  targetScore: number;
  combo: number;
  secondsLeft: number;
};

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function NinjaHud({ score, targetScore, combo, secondsLeft }: Props) {
  const comboScale = useSharedValue(1);
  const urgent = secondsLeft <= 60;
  const goalProgress = Math.min(100, (score / targetScore) * 100);

  useEffect(() => {
    if (combo < 2) return;
    comboScale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 220 }),
      withTiming(1, { duration: 220 }),
    );
  }, [combo, comboScale]);

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="mb-3 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Time
          </Text>
          <Text
            className={`font-mono text-2xl font-bold tabular-nums ${
              urgent ? "text-accent" : "text-foreground dark:text-d-text"
            }`}
          >
            {formatCountdown(secondsLeft)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Score
          </Text>
          <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
            {score}
            <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
              {" "}
              / {targetScore}
            </Text>
          </Text>
        </View>
      </View>

      <View className="mb-2">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Goal
          </Text>
          <Text className="font-mono text-sm font-bold tabular-nums text-accent">
            {Math.round(goalProgress)}%
          </Text>
        </View>
        <View className="h-2.5 overflow-hidden rounded-full bg-muted/30 dark:bg-d-muted/20">
          <View
            className="h-full rounded-full bg-accent"
            style={{ width: `${goalProgress}%` }}
          />
        </View>
      </View>

      {combo >= 2 ? (
        <Animated.View style={comboStyle} className="items-center pt-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-accent">
            Combo x{combo}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

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
  combo: number;
  secondsLeft: number;
};

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TapDestroyHud({ score, combo, secondsLeft }: Props) {
  const comboScale = useSharedValue(1);
  const urgent = secondsLeft <= 30;

  useEffect(() => {
    if (combo < 2) return;
    comboScale.value = withSequence(
      withSpring(1.22, { damping: 8, stiffness: 220 }),
      withTiming(1, { duration: 220 }),
    );
  }, [combo, comboScale]);

  const comboStyle = useAnimatedStyle(() => ({
    transform: [{ scale: comboScale.value }],
  }));

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="mb-3">
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

      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Score
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {score}
          </Text>
        </View>

        {combo >= 2 ? (
          <Animated.View style={comboStyle} className="items-end">
            <Text className="text-xs font-semibold uppercase tracking-widest text-accent">
              Combo
            </Text>
            <Text className="font-mono text-2xl font-bold tabular-nums text-accent">
              x{combo}
            </Text>
          </Animated.View>
        ) : (
          <View className="items-end">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Combo
            </Text>
            <Text className="font-mono text-2xl font-bold tabular-nums text-muted-foreground dark:text-d-muted">
              —
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

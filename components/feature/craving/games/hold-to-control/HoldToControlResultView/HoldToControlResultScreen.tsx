import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { formatDurationMs } from "@/utils/formatDuration";

type Props = {
  score: number;
  completedWaves: number;
  totalWaves: number;
  totalHoldMs: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function HoldToControlResultView({
  score,
  completedWaves,
  totalWaves,
  totalHoldMs,
  bestStreak,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const allDone = completedWaves >= totalWaves;

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons name="shield-checkmark" size={36} color={colors.accent} />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {allDone ? "You stayed in control" : "Strong effort"}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {allDone
            ? "Every hold weakened the craving. You protected your progress."
            : "You showed up and fought the urge. That counts."}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="w-full"
      >
        <View className="flex-row items-stretch justify-center gap-6">
          <View className="items-center">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Score
            </Text>
            <Text className="mt-2 font-mono text-5xl font-bold tabular-nums text-foreground dark:text-d-text">
              {score}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Waves
            </Text>
            <Text className="mt-2 font-mono text-5xl font-bold tabular-nums text-accent">
              {completedWaves}/{totalWaves}
            </Text>
          </View>
        </View>
        <View className="mt-6 flex-row items-stretch justify-center gap-6">
          <View className="items-center">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Hold time
            </Text>
            <Text className="mt-2 font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
              {formatDurationMs(totalHoldMs)}
            </Text>
          </View>
          {bestStreak >= 2 ? (
            <View className="items-center">
              <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                Best streak
              </Text>
              <Text className="mt-2 font-mono text-2xl font-bold tabular-nums text-accent">
                x{bestStreak}
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(380).duration(420)}
        className="w-full gap-3"
      >
        <Button label="Play again" size="lg" fullWidth onPress={onPlayAgain} />
        <Button
          label="Done"
          size="lg"
          variant="ghost"
          fullWidth
          onPress={onDone}
        />
      </Animated.View>
    </View>
  );
}

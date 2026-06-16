import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  won: boolean;
  timedOut: boolean;
  score: number;
  targetScore: number;
  bestCombo: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function NinjaResultView({
  won,
  timedOut,
  score,
  targetScore,
  bestCombo,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();

  const title = won
    ? "Goal reached!"
    : timedOut
      ? "Time's up"
      : "Battle paused";
  const subtitle = won
    ? `You scored ${score} and beat the ${targetScore} point goal.`
    : timedOut
      ? `You scored ${score} — reach ${targetScore} to win next time.`
      : `You scored ${score}. Keep slicing until you hit ${targetScore}.`;
  const icon = won ? "trophy" : timedOut ? "time-outline" : "flash";

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons name={icon} size={36} color={colors.accent} />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {title}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {subtitle}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="w-full items-center gap-5"
      >
        <View className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Final score
          </Text>
          <Text className="mt-2 font-mono text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
            {score}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
            Goal: {targetScore}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Best combo
          </Text>
          <Text className="mt-1 font-mono text-3xl font-bold tabular-nums text-accent">
            x{bestCombo}
          </Text>
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

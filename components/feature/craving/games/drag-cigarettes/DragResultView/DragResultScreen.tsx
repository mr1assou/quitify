import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  score: number;
  deathReason: "collision" | "fall" | null;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function DragResultView({
  score,
  deathReason,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const wrongColor = deathReason === "collision";
  const fell = deathReason === "fall";

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons
          name={wrongColor ? "skull-outline" : fell ? "arrow-down-circle-outline" : "flag-outline"}
          size={36}
          color={colors.accent}
        />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {wrongColor ? "Wrong color!" : fell ? "Fell down" : "Nice run"}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {wrongColor
            ? "Match your ball to the obstacle color next time."
            : fell
              ? "Keep tapping to stay in the air."
              : "You stopped on your terms. Every round builds focus."}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="w-full items-center"
      >
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Final score
        </Text>
        <Text className="mt-2 font-mono text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
          {score}
        </Text>
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

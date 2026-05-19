import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  status: "won" | "timeout";
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function MemoryResultView({
  status,
  matchedPairs,
  totalPairs,
  moves,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const won = status === "won";

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons
          name={won ? "sparkles" : "leaf"}
          size={36}
          color={colors.accent}
        />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {won ? "Mind cleared" : "Well done"}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {won
            ? "All pairs matched. Craving session complete."
            : "You broke the craving cycle. That counts."}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="items-center gap-1"
      >
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Pairs matched
        </Text>
        <Text className="font-mono text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
          {matchedPairs}/{totalPairs}
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
          in {moves} {moves === 1 ? "move" : "moves"}
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

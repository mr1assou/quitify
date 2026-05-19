import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  score: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function TapDestroyResultView({ score, onPlayAgain, onDone }: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons name="shield-checkmark" size={36} color={colors.accent} />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          Craving weakened
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          You protected your streak.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="items-center"
      >
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Cigarettes smashed
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

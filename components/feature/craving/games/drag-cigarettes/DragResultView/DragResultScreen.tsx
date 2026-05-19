import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  trashed: number;
  bestCombo: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function DragResultView({
  trashed,
  bestCombo,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons name="shield-checkmark" size={36} color={colors.accent} />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          You stayed in control
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          Every cigarette trashed is one you didn&apos;t smoke.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="w-full flex-row items-stretch justify-center gap-6"
      >
        <View className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Trashed
          </Text>
          <Text className="mt-2 font-mono text-5xl font-bold tabular-nums text-foreground dark:text-d-text">
            {trashed}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Best combo
          </Text>
          <Text className="mt-2 font-mono text-5xl font-bold tabular-nums text-accent">
            x{Math.max(bestCombo, 1)}
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

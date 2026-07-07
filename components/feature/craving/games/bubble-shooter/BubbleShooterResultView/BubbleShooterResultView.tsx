import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import type { BubbleShooterStatus } from "@/hooks/craving/games/useBubbleShooterGame";

type Props = {
  status: Extract<BubbleShooterStatus, "won" | "lost" | "finished">;
  poppedTotal: number;
  totalBubbles: number;
  shotsLanded: number;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function BubbleShooterResultView({
  status,
  poppedTotal,
  totalBubbles,
  shotsLanded,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const roundEnded = status === "won" || status === "lost";

  const title =
    status === "won"
      ? "All bubbles cleared!"
      : status === "lost"
        ? "Bubbles reached the line"
        : "Good session";

  const subtitle =
    status === "won"
      ? `You popped every one of the ${totalBubbles.toLocaleString("en-US")} bubbles.`
      : status === "lost"
        ? "The ceiling crept too low. Try again with sharper angles."
        : "You stopped when you felt ready. That's what counts.";

  const iconName =
    status === "won" ? "sparkles" : status === "lost" ? "alert-circle" : "checkmark-circle";

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons name={iconName} size={36} color={colors.accent} />
        <Text className="text-center text-2xl font-bold text-foreground dark:text-d-text">
          {title}
        </Text>
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {subtitle}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.delay(220).duration(500)}
        className="items-center gap-1"
      >
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Bubbles popped
        </Text>
        <Text className="font-mono text-5xl font-bold tabular-nums text-foreground dark:text-d-text">
          {poppedTotal.toLocaleString("en-US")}
          <Text className="text-2xl text-muted-foreground dark:text-d-muted">
            {" "}
            / {totalBubbles.toLocaleString("en-US")}
          </Text>
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
          in {shotsLanded.toLocaleString("en-US")}{" "}
          {shotsLanded === 1 ? "shot" : "shots"}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(380).duration(420)}
        className="w-full gap-3"
      >
        {roundEnded ? (
          <Button label="Play again" size="lg" fullWidth onPress={onPlayAgain} />
        ) : null}
        <Button
          label="Done"
          size="lg"
          variant={roundEnded ? "ghost" : "primary"}
          fullWidth
          onPress={onDone}
        />
      </Animated.View>
    </View>
  );
}

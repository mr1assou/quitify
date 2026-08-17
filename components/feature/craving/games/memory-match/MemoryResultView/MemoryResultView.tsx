import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  won?: boolean;
  timedOut?: boolean;
  onPlayAgain: () => void;
  onDone: () => void;
};

export function MemoryResultView({
  matchedPairs,
  totalPairs,
  moves,
  won = true,
  timedOut = false,
  onPlayAgain,
  onDone,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const title = won
    ? t("craving.memoryWonTitle")
    : timedOut
      ? t("craving.memoryTimedOutTitle")
      : t("craving.memoryStoppedTitle");
  const subtitle = won
    ? t("craving.memoryWonSubtitle")
    : timedOut
      ? t("craving.memoryTimedOutSubtitle")
      : t("craving.memoryStoppedSubtitle");

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <Animated.View
        entering={FadeInUp.duration(450)}
        className="items-center gap-3 px-4 pt-4"
      >
        <Ionicons
          name={won ? "sparkles" : timedOut ? "time-outline" : "checkmark-circle"}
          size={36}
          color={colors.accent}
        />
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
          {t("craving.pairsMatched")}
        </Text>
        <Text className="font-mono text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
          {matchedPairs}/{totalPairs}
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground dark:text-d-muted">
          {t(moves === 1 ? "craving.inMovesOne" : "craving.inMovesMany", { count: moves })}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(380).duration(420)}
        className="w-full gap-3"
      >
        <Button label={t("craving.playAgain")} size="lg" fullWidth onPress={onPlayAgain} />
        <Button
          label={t("craving.done")}
          size="lg"
          variant="ghost"
          fullWidth
          onPress={onDone}
        />
      </Animated.View>
    </View>
  );
}

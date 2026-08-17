import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

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
  const { t } = useTranslation();

  const title = won
    ? t("craving.ninjaWonTitle")
    : timedOut
      ? t("craving.ninjaTimedOutTitle")
      : t("craving.ninjaPausedTitle");
  const subtitle = won
    ? t("craving.ninjaWonSubtitle", { score, target: targetScore })
    : timedOut
      ? t("craving.ninjaTimedOutSubtitle", { score, target: targetScore })
      : t("craving.ninjaPausedSubtitle", { score, target: targetScore });
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
            {t("craving.finalScore")}
          </Text>
          <Text className="mt-2 font-mono text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
            {score}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground dark:text-d-muted">
            {t("craving.goalValue", { target: targetScore })}
          </Text>
        </View>

        <View className="items-center">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {t("craving.bestCombo")}
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

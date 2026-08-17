import { Text, View } from "react-native";

import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  secondsLeft: number;
};

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MemoryHud({
  matchedPairs,
  totalPairs,
  moves,
  secondsLeft,
}: Props) {
  const { t } = useTranslation();
  const urgent = secondsLeft <= 30;

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="mb-3">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {t("craving.timeLabel")}
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
            {t("craving.pairsLabel")}
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {matchedPairs}/{totalPairs}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {t("craving.movesLabel")}
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {moves}
          </Text>
        </View>
      </View>
    </View>
  );
}

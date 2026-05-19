import { Text, View } from "react-native";

import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  secondsLeft: number;
  totalSeconds: number;
  matchedPairs: number;
  totalPairs: number;
};

export function MemoryHud({
  secondsLeft,
  totalSeconds,
  matchedPairs,
  totalPairs,
}: Props) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;

  return (
    <View className="px-6 pb-2 pt-1">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Time
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {String(secondsLeft).padStart(2, "0")}s
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Pairs
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {matchedPairs}/{totalPairs}
          </Text>
        </View>
      </View>
      <View className="mt-3">
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
}

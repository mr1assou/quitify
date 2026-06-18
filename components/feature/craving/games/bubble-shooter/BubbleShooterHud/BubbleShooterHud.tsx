import { Text, View } from "react-native";

import { BUBBLE_SHOOTER_TOTAL_BUBBLES } from "@/constants/craving/games/bubbleShooter";

type Props = {
  poppedTotal: number;
  bubblesInPool: number;
  clearProgress: number;
  shotsLanded: number;
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function BubbleShooterHud({
  poppedTotal,
  bubblesInPool,
  clearProgress,
  shotsLanded,
}: Props) {
  return (
    <View className="px-6 pb-2 pt-1">
      <View className="mb-3 flex-row items-end justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Progress
          </Text>
          <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
            {formatCount(poppedTotal)}
            <Text className="text-lg text-muted-foreground dark:text-d-muted">
              {" "}
              / {formatCount(BUBBLE_SHOOTER_TOTAL_BUBBLES)}
            </Text>
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Waiting
          </Text>
          <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
            {formatCount(bubblesInPool)}
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Shots
          </Text>
          <Text className="font-mono text-2xl font-bold tabular-nums text-foreground dark:text-d-text">
            {formatCount(shotsLanded)}
          </Text>
        </View>
      </View>

      <View className="h-2 overflow-hidden rounded-full bg-section dark:bg-d-elevated">
        <View
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, clearProgress)}%` }}
        />
      </View>
    </View>
  );
}

import { Text, View } from "react-native";

import { BUBBLE_SHOOTER_TOTAL_BUBBLES } from "@/constants/craving/games/bubbleShooter";

type Props = {
  poppedTotal: number;
  clearProgress: number;
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function BubbleShooterHud({ poppedTotal, clearProgress }: Props) {
  const progressLabel = `${Math.floor(Math.min(100, clearProgress))}%`;

  return (
    <View className="px-4 pb-2 pt-1">
      <View className="rounded-2xl border border-border bg-section/90 px-4 py-3 dark:border-d-border dark:bg-d-elevated/95">
        <View className="mb-3 flex-row items-end justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Bubble Run
            </Text>
            <Text className="font-mono text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
              {formatCount(poppedTotal)}
              <Text className="text-base text-muted-foreground dark:text-d-muted">
                {" "}
                / {formatCount(BUBBLE_SHOOTER_TOTAL_BUBBLES)}
              </Text>
            </Text>
          </View>

          <View className="rounded-xl bg-primary/12 px-3 py-1.5 dark:bg-primary/18">
            <Text className="font-mono text-lg font-bold text-primary">{progressLabel}</Text>
          </View>
        </View>

        <View className="h-2.5 overflow-hidden rounded-full bg-background/70 dark:bg-d-bg/80">
          <View
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(100, clearProgress)}%` }}
          />
        </View>
      </View>
    </View>
  );
}

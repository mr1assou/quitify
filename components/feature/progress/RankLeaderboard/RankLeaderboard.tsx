import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LeaderboardRow } from "@/components/feature/progress/LeaderboardRow";
import { Card } from "@/components/ui/Card";
import type { LeaderboardSnapshot } from "@/types/leaderboard";

type Props = {
  leaderboard: LeaderboardSnapshot;
};

export function RankLeaderboard({ leaderboard }: Props) {
  const { others } = leaderboard;

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section" padded={false}>
        <View className="border-b border-background px-4 py-3 dark:border-d-border">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Global leaderboard
          </Text>
        </View>

        <View className="px-2 pb-2 pt-2">
          {others.map((row, index) => {
            if (row.kind !== "entry") return null;
            return (
              <LeaderboardRow
                key={`${row.entry.rank}-${row.entry.name}`}
                entry={row.entry}
                showDivider={index > 0}
              />
            );
          })}
        </View>
      </Card>
    </Animated.View>
  );
}

import { useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LeaderboardRow } from "@/components/feature/progress/LeaderboardRow";
import { Card } from "@/components/ui/Card";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard";

type Props = {
  leaderboard: LeaderboardSnapshot;
};

function allLeaderboardEntries(leaderboard: LeaderboardSnapshot): LeaderboardEntry[] {
  const byKey = new Map<string, LeaderboardEntry>();

  for (const row of leaderboard.others) {
    if (row.kind !== "entry") continue;
    const key = row.entry.userId != null ? `u-${row.entry.userId}` : `r-${row.entry.rank}`;
    byKey.set(key, row.entry);
  }

  const currentKey =
    leaderboard.currentUser.userId != null
      ? `u-${leaderboard.currentUser.userId}`
      : `r-${leaderboard.currentUser.rank}`;
  byKey.set(currentKey, leaderboard.currentUser);

  return [...byKey.values()].sort((a, b) => a.rank - b.rank);
}

export function RankLeaderboard({ leaderboard }: Props) {
  const visibleRows = useMemo(() => allLeaderboardEntries(leaderboard), [leaderboard]);

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section" padded={false}>
        <View className="border-b border-background px-4 py-3 dark:border-d-border">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Global leaderboard
          </Text>
        </View>

        <View className="px-2 pb-2 pt-2">
          {visibleRows.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId ?? `${entry.rank}-${entry.name}`}
              entry={entry}
              showDivider={index > 0}
            />
          ))}
          {visibleRows.length === 0 ? (
            <View className="px-4 py-6">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                No players on the leaderboard yet.
              </Text>
            </View>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
}

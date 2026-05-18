import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LeaderboardRow } from "@/components/feature/progress/LeaderboardRow";
import { Card } from "@/components/ui/Card";
import type { LeaderboardSnapshot } from "@/types/leaderboard";
import { COMMUNITY_TOP_COUNT } from "@/utils/leaderboard";
import { formatNumber } from "@/utils/format";

type Props = {
  leaderboard: LeaderboardSnapshot;
};

export function RankLeaderboard({ leaderboard }: Props) {
  const { currentUser, others, totalUsers } = leaderboard;
  const otherCount = others.filter((r) => r.kind === "entry").length;

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section" padded={false}>
        <View className="border-b border-background px-4 py-3 dark:border-d-border">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Global leaderboard
          </Text>
          <Text className="mt-0.5 text-sm text-muted-foreground dark:text-d-muted">
            Your rank among {formatNumber(totalUsers)} people
          </Text>
        </View>

        <View className="px-2 pt-2">
          <LeaderboardRow
            entry={currentUser}
            pinned
            totalUsers={totalUsers}
          />
        </View>

        <View className="mx-4 my-2 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-background dark:bg-d-border" />
          <Text className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Community
          </Text>
          <View className="h-px flex-1 bg-background dark:bg-d-border" />
        </View>

        <View className="pb-2">
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

        {otherCount > 0 ? (
          <Text className="border-t border-background px-4 py-3 text-center text-xs text-muted-foreground dark:border-d-border dark:text-d-muted">
            Top {COMMUNITY_TOP_COUNT} in the community
          </Text>
        ) : null}
      </Card>
    </Animated.View>
  );
}

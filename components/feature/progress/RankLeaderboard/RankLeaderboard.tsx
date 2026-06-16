import { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { LeaderboardRow } from "@/components/feature/progress/LeaderboardRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";
import { listLeaderboardEntries } from "@/utils/leaderboard/findLeaderboardEntry";

type Props = {
  leaderboard: LeaderboardSnapshot;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
};

function buildVisibleRows(leaderboard: LeaderboardSnapshot): {
  pinnedViewer: LeaderboardEntry | null;
  pageRows: LeaderboardEntry[];
} {
  const entries = listLeaderboardEntries(leaderboard);
  const viewer = leaderboard.currentUser;
  const viewerOnPage = entries.some(
    (entry) => entry.userId != null && entry.userId === viewer.userId,
  );

  const pageRows = entries.filter(
    (entry) => !(viewerOnPage && entry.userId != null && entry.userId === viewer.userId),
  );

  return {
    pinnedViewer: viewerOnPage ? null : viewer,
    pageRows: viewerOnPage ? entries : pageRows,
  };
}

export function RankLeaderboard({ leaderboard, hasMore, loadingMore, onLoadMore }: Props) {
  const { pinnedViewer, pageRows } = useMemo(
    () => buildVisibleRows(leaderboard),
    [leaderboard],
  );

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section" padded={false}>
        <View className="border-b border-background px-4 py-3 dark:border-d-border">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Global leaderboard
          </Text>
        </View>

        <View className="px-2 pb-2 pt-2">
          {pinnedViewer ? (
            <>
              <LeaderboardRow entry={pinnedViewer} />
              {pageRows.length > 0 ? (
                <View className="mx-3 my-1 h-px bg-background dark:bg-d-border" />
              ) : null}
            </>
          ) : null}

          {pageRows.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId ?? `${entry.rank}-${entry.name}`}
              entry={entry}
              showDivider={index > 0 || pinnedViewer !== null}
            />
          ))}

          {pageRows.length === 0 && !pinnedViewer ? (
            <View className="px-4 py-6">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                No players on the leaderboard yet.
              </Text>
            </View>
          ) : null}

          {hasMore ? (
            <View className="px-3 pt-3">
              {loadingMore ? (
                <View className="items-center py-2">
                  <ActivityIndicator />
                </View>
              ) : (
                <Button label="Load more" variant="secondary" fullWidth onPress={onLoadMore} />
              )}
            </View>
          ) : null}
        </View>
      </Card>
    </Animated.View>
  );
}

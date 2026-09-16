import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";

type Props = {
  /** True while the Rank tab is selected — triggers a soft browse refresh. */
  active: boolean;
};

/** Mounted on first Rank visit, then kept alive for instant tab switches. */
export function AwardsRankSection({ active }: Props) {
  const { colors } = useTheme();
  const {
    snapshot: leaderboard,
    loading,
    hasMore,
    hasMoreAbove,
    loadingMore,
    loadingAbove,
    viewMode,
    loadMore,
    loadMoreAbove,
    resetToBrowse,
    spotAroundCurrentUser,
  } = useLeaderboard();

  const resetToBrowseRef = useRef(resetToBrowse);
  resetToBrowseRef.current = resetToBrowse;

  useEffect(() => {
    if (!active) return;
    void resetToBrowseRef.current();
  }, [active]);

  // Always paint Rank UI immediately — loader until the first page is ready.
  if (!leaderboard) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <RankLeaderboard
      leaderboard={leaderboard}
      hasMore={hasMore}
      hasMoreAbove={hasMoreAbove}
      loadingMore={loadingMore || loading}
      loadingAbove={loadingAbove}
      viewMode={viewMode}
      onLoadMore={loadMore}
      onLoadMoreAbove={loadMoreAbove}
      onSpotAroundCurrentUser={spotAroundCurrentUser}
    />
  );
}

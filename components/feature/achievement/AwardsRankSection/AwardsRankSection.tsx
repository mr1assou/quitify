import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";

type Props = {
  screenHeader?: ReactNode;
};

/** Loads the leaderboard when its dedicated screen opens. */
export function AwardsRankSection({ screenHeader }: Props) {
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
  const [serverReady, setServerReady] = useState(false);

  // This screen never paints the list saved by Stats or other screens.
  // The first open always waits for a server response.
  useEffect(() => {
    let active = true;
    void resetToBrowseRef.current().finally(() => {
      if (active) setServerReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!serverReady || !leaderboard) {
    return (
      <View className="flex-1">
        {screenHeader}
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <RankLeaderboard
      screenHeader={screenHeader}
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

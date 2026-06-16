import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";

import { LEADERBOARD_PAGE_SIZE } from "@/constants/leaderboardPagination";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { fetchLeaderboard } from "@/services/leaderboard/leaderboardApi";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard";
import { dbAuthorId, resolveOnlineFromMap } from "@/utils/community/presence";
import { getLeaderboardCache, setLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import {
  mapLeaderboardFromApi,
  mergeLeaderboardPages,
} from "@/utils/leaderboard/mapLeaderboardFromApi";

export type UseLeaderboardResult = {
  snapshot: LeaderboardSnapshot | null;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
};

function applyLivePresence(
  entry: LeaderboardEntry,
  onlineByUserId: Record<number, boolean>,
  presenceReady: boolean,
): LeaderboardEntry {
  if (entry.isCurrentUser) {
    return { ...entry, isOnline: true };
  }

  if (!entry.userId) return entry;

  const isOnline = resolveOnlineFromMap(
    dbAuthorId(entry.userId),
    onlineByUserId,
    entry.isOnline,
    presenceReady,
  );

  if (isOnline === undefined) return entry;
  return { ...entry, isOnline };
}

function withLivePresence(
  snapshot: LeaderboardSnapshot,
  onlineByUserId: Record<number, boolean>,
  presenceReady: boolean,
): LeaderboardSnapshot {
  return {
    ...snapshot,
    currentUser: applyLivePresence(snapshot.currentUser, onlineByUserId, presenceReady),
    others: snapshot.others.map((row) =>
      row.kind === "entry"
        ? {
            kind: "entry",
            entry: applyLivePresence(row.entry, onlineByUserId, presenceReady),
          }
        : row,
    ),
  };
}

/** Global leaderboard loaded from the API (ranked by Freedom Points, 15 per page). */
export function useLeaderboard(): UseLeaderboardResult {
  const { state: appState } = useApp();
  const { state: communityState } = useCommunity();
  const [snapshot, setSnapshot] = useState<LeaderboardSnapshot | null>(
    () => getLeaderboardCache(),
  );
  const [loading, setLoading] = useState(!getLeaderboardCache());
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(getLeaderboardCache()?.hasMore ?? false);
  const loadingMoreRef = useRef(false);

  const loadPage = useCallback(
    async (offset: number, append: boolean) => {
      if (!appState.account) return;

      if (append) {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetchLeaderboard({ offset, limit: LEADERBOARD_PAGE_SIZE });
        const mapped = mapLeaderboardFromApi(response);

        setSnapshot((previous) => {
          const nextSnapshot =
            append && previous ? mergeLeaderboardPages(previous, mapped) : mapped;
          setLeaderboardCache(nextSnapshot);
          return nextSnapshot;
        });
        setHasMore(response.has_more);
      } catch {
        if (!append) {
          setLeaderboardCache(null);
          setSnapshot(null);
          setHasMore(false);
        }
      } finally {
        if (append) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [appState.account],
  );

  const refresh = useCallback(() => {
    void loadPage(0, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    setSnapshot((current) => {
      if (!current || !current.hasMore || loadingMoreRef.current) return current;
      void loadPage(current.nextOffset, true);
      return current;
    });
  }, [loadPage]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const liveSnapshot = useMemo(() => {
    if (!snapshot) return null;

    return withLivePresence(
      snapshot,
      communityState.onlineByUserId,
      communityState.presenceReady,
    );
  }, [
    communityState.onlineByUserId,
    communityState.presenceReady,
    snapshot,
  ]);

  return {
    snapshot: liveSnapshot,
    loading,
    loadingMore,
    hasMore,
    loadMore,
  };
}

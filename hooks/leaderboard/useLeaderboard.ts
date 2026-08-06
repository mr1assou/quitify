import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { LEADERBOARD_PAGE_SIZE } from "@/constants/leaderboard/leaderboardPagination";
import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { fetchLeaderboard } from "@/services/leaderboard/leaderboardApi";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard/leaderboard";
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
  refresh: () => Promise<void>;
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
    currentUser: snapshot.currentUser
      ? applyLivePresence(snapshot.currentUser, onlineByUserId, presenceReady)
      : null,
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

/** Global leaderboard loaded from the API (ranked by Freedom Points, 10 per page). */
export function useLeaderboard(): UseLeaderboardResult {
  const { state: appState } = useApp();
  const { state: communityState } = useCommunity();
  const accountUserId = appState.account?.userId ?? null;
  const [snapshot, setSnapshot] = useState<LeaderboardSnapshot | null>(
    () => getLeaderboardCache(),
  );
  const [loading, setLoading] = useState(() => getLeaderboardCache() == null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(getLeaderboardCache()?.hasMore ?? false);
  const loadingMoreRef = useRef(false);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const prevAccountUserIdRef = useRef<number | null | undefined>(undefined);

  const loadPage = useCallback(async (offset: number, append: boolean) => {
    if (accountUserId == null) {
      if (!append) setLoading(false);
      return;
    }

    if (append) {
      if (loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
    } else if (snapshotRef.current == null) {
      // Full-screen loader only when there is nothing to show yet.
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
  }, [accountUserId]);

  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;

  const refresh = useCallback(() => loadPage(0, false), [loadPage]);

  const loadMore = useCallback(() => {
    setSnapshot((current) => {
      if (!current || !current.hasMore || loadingMoreRef.current) return current;
      void loadPage(current.nextOffset, true);
      return current;
    });
  }, [loadPage]);

  // One silent/background refresh per real tab focus (keeps existing ranks visible).
  useFocusEffect(
    useCallback(() => {
      void loadPageRef.current(0, false);
    }, []),
  );

  useEffect(() => {
    if (prevAccountUserIdRef.current === undefined) {
      prevAccountUserIdRef.current = accountUserId;
      return;
    }
    if (prevAccountUserIdRef.current === accountUserId) return;
    prevAccountUserIdRef.current = accountUserId;
    if (accountUserId == null) return;
    void loadPageRef.current(0, false);
  }, [accountUserId]);

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
    refresh,
  };
}

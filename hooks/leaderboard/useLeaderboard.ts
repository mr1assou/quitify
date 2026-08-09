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
  /**
   * Loads pages of 10 until the viewer's rank is covered by loaded offsets,
   * so Spot my rank can scroll to them in-list.
   */
  loadUntilCurrentUserRank: () => Promise<boolean>;
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

/** True when loaded pages reach the viewer's rank (10-by-10 offsets). */
function hasLoadedThroughViewerRank(snapshot: LeaderboardSnapshot): boolean {
  const viewer = snapshot.currentUser;
  if (!viewer) return false;
  return snapshot.nextOffset >= viewer.rank || !snapshot.hasMore;
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

  const loadPage = useCallback(
    async (offset: number, append: boolean): Promise<LeaderboardSnapshot | null> => {
      if (accountUserId == null) {
        if (!append) setLoading(false);
        return null;
      }

      if (append) {
        if (loadingMoreRef.current) return snapshotRef.current;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else if (snapshotRef.current == null) {
        setLoading(true);
      }

      try {
        const response = await fetchLeaderboard({
          offset,
          limit: LEADERBOARD_PAGE_SIZE,
        });
        const mapped = mapLeaderboardFromApi(response);
        const previous = snapshotRef.current;
        const nextSnapshot =
          append && previous ? mergeLeaderboardPages(previous, mapped) : mapped;

        snapshotRef.current = nextSnapshot;
        setLeaderboardCache(nextSnapshot);
        setSnapshot(nextSnapshot);
        setHasMore(response.has_more);
        return nextSnapshot;
      } catch {
        if (!append) {
          setLeaderboardCache(null);
          snapshotRef.current = null;
          setSnapshot(null);
          setHasMore(false);
        }
        return snapshotRef.current;
      } finally {
        if (append) {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accountUserId],
  );

  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;

  const refresh = useCallback(() => loadPage(0, false).then(() => undefined), [loadPage]);

  const loadMore = useCallback(() => {
    const current = snapshotRef.current;
    if (!current || !current.hasMore || loadingMoreRef.current) return;
    void loadPage(current.nextOffset, true);
  }, [loadPage]);

  const loadUntilCurrentUserRank = useCallback(async (): Promise<boolean> => {
    let current = snapshotRef.current;
    if (!current?.currentUser) return false;
    if (hasLoadedThroughViewerRank(current)) return true;

    // Cap pages so a bad rank cannot loop forever (10 users/page).
    const maxPages = 500;
    for (let i = 0; i < maxPages; i += 1) {
      if (!current.hasMore) return true;
      if (hasLoadedThroughViewerRank(current)) return true;

      const next = await loadPage(current.nextOffset, true);
      if (!next) return false;
      current = next;
    }

    return hasLoadedThroughViewerRank(current);
  }, [loadPage]);

  useEffect(() => {
    if (prevAccountUserIdRef.current === undefined) {
      prevAccountUserIdRef.current = accountUserId;
      if (accountUserId != null && snapshotRef.current == null) {
        void loadPageRef.current(0, false);
      }
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
    loadUntilCurrentUserRank,
  };
}

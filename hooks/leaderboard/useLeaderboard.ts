import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  LEADERBOARD_AROUND_ABOVE,
  LEADERBOARD_AROUND_PAGE_SIZE,
  LEADERBOARD_PAGE_SIZE,
} from "@/constants/leaderboard/leaderboardPagination";
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

export type LeaderboardViewMode = "browse" | "around";

export type UseLeaderboardResult = {
  snapshot: LeaderboardSnapshot | null;
  loading: boolean;
  loadingMore: boolean;
  loadingAbove: boolean;
  hasMore: boolean;
  /** True when around-mode window can still load better ranks. */
  hasMoreAbove: boolean;
  viewMode: LeaderboardViewMode;
  loadMore: () => void;
  loadMoreAbove: () => void;
  refresh: () => Promise<void>;
  /** One request: load a small on-screen section around you. */
  spotAroundCurrentUser: () => Promise<boolean>;
  /** Leave Spot mode and reload ranks 1–10 (normal browse). */
  resetToBrowse: () => Promise<void>;
  backToTop: () => Promise<void>;
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

function aroundOffsetForRank(rank: number): number {
  return Math.max(0, rank - 1 - LEADERBOARD_AROUND_ABOVE);
}

/** Global leaderboard — browse from the top, or jump around you with up/down pages. */
export function useLeaderboard(): UseLeaderboardResult {
  const { state: appState } = useApp();
  const { state: communityState } = useCommunity();
  const accountUserId = appState.account?.userId ?? null;
  const [snapshot, setSnapshot] = useState<LeaderboardSnapshot | null>(
    () => getLeaderboardCache(),
  );
  const [loading, setLoading] = useState(() => getLeaderboardCache() == null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAbove, setLoadingAbove] = useState(false);
  const [hasMore, setHasMore] = useState(getLeaderboardCache()?.hasMore ?? false);
  const [viewMode, setViewMode] = useState<LeaderboardViewMode>("browse");
  const loadingMoreRef = useRef(false);
  const loadingAboveRef = useRef(false);
  const spottingRef = useRef(false);
  const refreshGenerationRef = useRef(0);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const prevAccountUserIdRef = useRef<number | null | undefined>(undefined);

  const commitSnapshot = useCallback((next: LeaderboardSnapshot) => {
    snapshotRef.current = next;
    setLeaderboardCache(next);
    setSnapshot(next);
    setHasMore(next.hasMore);
  }, []);

  const loadPage = useCallback(
    async (
      offset: number,
      append: boolean,
      limit: number = LEADERBOARD_PAGE_SIZE,
    ): Promise<LeaderboardSnapshot | null> => {
      if (accountUserId == null) {
        if (!append) setLoading(false);
        return null;
      }

      let requestGeneration: number;

      if (append) {
        if (loadingMoreRef.current || spottingRef.current || loadingAboveRef.current) {
          return snapshotRef.current;
        }
        requestGeneration = refreshGenerationRef.current;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        if (spottingRef.current) {
          return snapshotRef.current;
        }
        requestGeneration = ++refreshGenerationRef.current;
        loadingMoreRef.current = false;
        loadingAboveRef.current = false;
        setLoadingMore(false);
        setLoadingAbove(false);
        if (snapshotRef.current == null) {
          setLoading(true);
        }
      }

      try {
        const response = await fetchLeaderboard({ offset, limit });

        if (requestGeneration !== refreshGenerationRef.current) {
          return snapshotRef.current;
        }

        const mapped = mapLeaderboardFromApi(response);
        const previous = snapshotRef.current;
        const nextSnapshot =
          append && previous ? mergeLeaderboardPages(previous, mapped) : mapped;

        commitSnapshot(nextSnapshot);
        if (!append) setViewMode("browse");
        return nextSnapshot;
      } catch {
        if (!append && requestGeneration === refreshGenerationRef.current) {
          setLeaderboardCache(null);
          snapshotRef.current = null;
          setSnapshot(null);
          setHasMore(false);
        }
        return snapshotRef.current;
      } finally {
        if (requestGeneration === refreshGenerationRef.current) {
          if (append) {
            loadingMoreRef.current = false;
            setLoadingMore(false);
          } else {
            setLoading(false);
          }
        }
      }
    },
    [accountUserId, commitSnapshot],
  );

  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;

  const refresh = useCallback(() => loadPage(0, false).then(() => undefined), [loadPage]);

  const backToTop = useCallback(() => loadPage(0, false).then(() => undefined), [loadPage]);

  /**
   * Leave Spot-window and reload top of board (10-by-10 browse).
   * Used when Awards gains focus so Spot state never sticks across screens.
   */
  const resetToBrowse = useCallback(async () => {
    spottingRef.current = false;
    setViewMode("browse");

    const current = snapshotRef.current;
    // Spot window starts mid-board — drop it so we don't flash those ranks as "browse".
    if (current && current.startOffset > 0) {
      snapshotRef.current = null;
      setLeaderboardCache(null);
      setSnapshot(null);
      setHasMore(false);
      setLoading(true);
    }

    await loadPage(0, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    const current = snapshotRef.current;
    if (
      !current ||
      !current.hasMore ||
      loadingMoreRef.current ||
      loadingAboveRef.current ||
      spottingRef.current
    ) {
      return;
    }
    void loadPage(current.nextOffset, true, LEADERBOARD_PAGE_SIZE);
  }, [loadPage]);

  /** Prepend better ranks above the current around/browse window. */
  const loadMoreAbove = useCallback(() => {
    const current = snapshotRef.current;
    if (
      !current ||
      current.startOffset <= 0 ||
      loadingMoreRef.current ||
      loadingAboveRef.current ||
      spottingRef.current ||
      accountUserId == null
    ) {
      return;
    }

    const limit = Math.min(LEADERBOARD_PAGE_SIZE, current.startOffset);
    const offset = current.startOffset - limit;
    const generationAtStart = refreshGenerationRef.current;

    loadingAboveRef.current = true;
    setLoadingAbove(true);

    void (async () => {
      try {
        const response = await fetchLeaderboard({ offset, limit });
        if (generationAtStart !== refreshGenerationRef.current) return;

        const mapped = mapLeaderboardFromApi(response);
        const previous = snapshotRef.current;
        if (!previous) return;

        commitSnapshot(mergeLeaderboardPages(previous, mapped));
      } finally {
        if (generationAtStart === refreshGenerationRef.current) {
          loadingAboveRef.current = false;
          setLoadingAbove(false);
        }
      }
    })();
  }, [accountUserId, commitSnapshot]);

  const spotAroundCurrentUser = useCallback(async (): Promise<boolean> => {
    const current = snapshotRef.current;
    const viewer = current?.currentUser;
    if (!viewer || accountUserId == null) return false;

    spottingRef.current = true;
    const generationAtStart = refreshGenerationRef.current;

    try {
      const offset = aroundOffsetForRank(viewer.rank);
      const response = await fetchLeaderboard({
        offset,
        limit: LEADERBOARD_AROUND_PAGE_SIZE,
      });

      if (generationAtStart !== refreshGenerationRef.current) return false;

      const mapped = mapLeaderboardFromApi(response);
      commitSnapshot(mapped);
      setViewMode("around");
      return mapped.currentUser != null;
    } catch {
      return false;
    } finally {
      spottingRef.current = false;
    }
  }, [accountUserId, commitSnapshot]);

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

  const hasMoreAbove =
    viewMode === "around" && (liveSnapshot?.startOffset ?? 0) > 0;

  return {
    snapshot: liveSnapshot,
    loading,
    loadingMore,
    loadingAbove,
    hasMore,
    hasMoreAbove,
    viewMode,
    loadMore,
    loadMoreAbove,
    refresh,
    spotAroundCurrentUser,
    resetToBrowse,
    backToTop,
  };
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  LEADERBOARD_AROUND_PAGE_SIZE,
  LEADERBOARD_AROUND_RADIUS,
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
  hasMore: boolean;
  /** browse = from #1 downward; around = neighborhood jump from Spot my rank */
  viewMode: LeaderboardViewMode;
  loadMore: () => void;
  refresh: () => Promise<void>;
  /** One request: load ~25 players around you (scales to tens of thousands). */
  spotAroundCurrentUser: () => Promise<boolean>;
  /** Return to the top of the global board. */
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
  return Math.max(0, rank - 1 - LEADERBOARD_AROUND_RADIUS);
}

/** Global leaderboard — browse from the top, or jump to a window around you. */
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
  const [viewMode, setViewMode] = useState<LeaderboardViewMode>("browse");
  const loadingMoreRef = useRef(false);
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
        if (loadingMoreRef.current || spottingRef.current) return snapshotRef.current;
        requestGeneration = refreshGenerationRef.current;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        if (spottingRef.current) {
          return snapshotRef.current;
        }
        requestGeneration = ++refreshGenerationRef.current;
        loadingMoreRef.current = false;
        setLoadingMore(false);
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

  const loadMore = useCallback(() => {
    const current = snapshotRef.current;
    if (!current || !current.hasMore || loadingMoreRef.current || spottingRef.current) {
      return;
    }
    void loadPage(current.nextOffset, true, LEADERBOARD_PAGE_SIZE);
  }, [loadPage]);

  /**
   * How big apps do it: never download ranks 1…N.
   * One request for a small neighborhood around your rank, then scroll inside it.
   */
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

  return {
    snapshot: liveSnapshot,
    loading,
    loadingMore,
    hasMore,
    viewMode,
    loadMore,
    refresh,
    spotAroundCurrentUser,
    backToTop,
  };
}

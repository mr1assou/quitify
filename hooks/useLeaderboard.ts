import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useCommunity } from "@/context/CommunityContext";
import { fetchLeaderboard } from "@/services/leaderboard/leaderboardApi";
import type { LeaderboardEntry, LeaderboardSnapshot } from "@/types/leaderboard";
import { dbAuthorId, resolveOnlineFromMap } from "@/utils/community/presence";
import { getLeaderboardCache, setLeaderboardCache } from "@/utils/leaderboard/leaderboardCache";
import { mapLeaderboardFromApi } from "@/utils/leaderboard/mapLeaderboardFromApi";

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
    totalUsers: snapshot.totalUsers,
  };
}

/** Global leaderboard loaded from the API (registration order, static FP/badge for now). */
export function useLeaderboard(): LeaderboardSnapshot | null {
  const { state: appState } = useApp();
  const { state: communityState } = useCommunity();
  const [snapshot, setSnapshot] = useState<LeaderboardSnapshot | null>(
    () => getLeaderboardCache(),
  );

  const load = useCallback(async () => {
    if (!appState.account) return;

    try {
      const response = await fetchLeaderboard();
      const mapped = mapLeaderboardFromApi(response);
      setLeaderboardCache(mapped);
      setSnapshot(mapped);
    } catch {
      setLeaderboardCache(null);
      setSnapshot(null);
    }
  }, [appState.account]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return useMemo(() => {
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
}

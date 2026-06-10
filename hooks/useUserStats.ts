import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchUserStats } from "@/services/stats/statsApi";
import type { UserStatsResponse } from "@/types/userStats";

export function useUserStats() {
  const [data, setData] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const stats = await fetchUserStats();
      setData(stats);
      setError(null);
    } catch {
      setData(null);
      setError("Could not load your stats. Pull to refresh or try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { data, loading, error, refresh };
}

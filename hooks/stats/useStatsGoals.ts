import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchStatsGoals } from "@/services/stats/statsApi";
import type { StatsGoalsResponse } from "@/types/stats/statsGoals";

export function useStatsGoals() {
  const [data, setData] = useState<StatsGoalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const goals = await fetchStatsGoals();
      setData(goals);
      setError(null);
    } catch {
      setData(null);
      setError("Could not load goals. Pull to refresh or try again later.");
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

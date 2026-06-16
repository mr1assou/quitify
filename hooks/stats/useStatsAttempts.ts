import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchStatsAttempts } from "@/services/stats/statsApi";
import type { StatsAttemptsResponse } from "@/types/stats/statsAttempts";

export function useStatsAttempts() {
  const [data, setData] = useState<StatsAttemptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const attempts = await fetchStatsAttempts();
      setData(attempts);
      setError(null);
    } catch {
      setData(null);
      setError("Could not load attempts. Pull to refresh or try again later.");
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

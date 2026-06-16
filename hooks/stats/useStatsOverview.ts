import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchStatsOverview } from "@/services/stats/statsApi";
import type { StatsOverviewResponse } from "@/types/stats/statsOverview";

export function useStatsOverview() {
  const [data, setData] = useState<StatsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const overview = await fetchStatsOverview();
      setData(overview);
      setError(null);
    } catch {
      setData(null);
      setError("Could not load overview. Pull to refresh or try again later.");
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

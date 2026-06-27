import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { fetchStatsFreedomPoints } from "@/services/stats/statsApi";
import type { StatsFreedomPointsResponse } from "@/types/stats/statsFreedomPoints";

export function useStatsFreedomPoints() {
  const [data, setData] = useState<StatsFreedomPointsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const freedomPoints = await fetchStatsFreedomPoints();
      setData(freedomPoints);
      setError(null);
    } catch {
      setData(null);
      setError("Could not load Freedom points history. Pull to refresh or try again later.");
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

import { useCallback, useEffect, useState } from "react";

import { useNow } from "@/hooks/shared/useNow";
import { fetchPlanState, togglePlanTask } from "@/services/plan/planApi";
import type { PlanState } from "@/types/plan/planState";

export function usePlanState() {
  const now = useNow(60_000);
  const [planState, setPlanState] = useState<PlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const state = await fetchPlanState();
      setPlanState(state);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load plan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, now]);

  const toggleTaskOnServer = useCallback(
    async (planDay: number, taskId: string, done: boolean) => {
      const state = await togglePlanTask(planDay, taskId, done);
      setPlanState(state);
      return state;
    },
    [],
  );

  return {
    planState,
    loading,
    error,
    refresh,
    toggleTaskOnServer,
  };
}

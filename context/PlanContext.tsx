import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/shared/useNow";
import { fetchPlanState, togglePlanTask } from "@/services/plan/planApi";
import type { PlanState } from "@/types/plan/planState";

type PlanContextValue = {
  planState: PlanState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleTaskOnServer: (planDay: number, taskId: string, done: boolean) => Promise<PlanState>;
};

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { state, isHydrated } = useApp();
  const now = useNow(60_000);
  const [planState, setPlanState] = useState<PlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canLoadPlan = isHydrated && state.isOnboarded && Boolean(state.account);

  const refresh = useCallback(async () => {
    if (!canLoadPlan) {
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const next = await fetchPlanState();
      setPlanState(next);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load plan";
      if (message !== "Not authenticated") {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [canLoadPlan]);

  useEffect(() => {
    if (!canLoadPlan) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    void refresh();
  }, [canLoadPlan, refresh, now]);

  const toggleTaskOnServer = useCallback(
    async (planDay: number, taskId: string, done: boolean) => {
      const state = await togglePlanTask(planDay, taskId, done);
      setPlanState(state);
      return state;
    },
    [],
  );

  const value = useMemo(
    () => ({
      planState,
      loading,
      error,
      refresh,
      toggleTaskOnServer,
    }),
    [planState, loading, error, refresh, toggleTaskOnServer],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlanContext() {
  const value = useContext(PlanContext);
  if (!value) {
    throw new Error("usePlanContext must be used within PlanProvider");
  }
  return value;
}

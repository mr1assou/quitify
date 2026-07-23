import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/shared/useNow";
import { fetchPlanState, savePlanTaskNote, togglePlanTask } from "@/services/plan/planApi";
import type { PlanState } from "@/types/plan/planState";

type PlanContextValue = {
  planState: PlanState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleTaskOnServer: (planDay: number, taskId: string, done: boolean) => Promise<PlanState>;
  saveTaskNoteOnServer: (planDay: number, taskId: string, note: string) => Promise<PlanState>;
};

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  const { state, isHydrated } = useApp();
  const now = useNow(60_000);
  const [planState, setPlanState] = useState<PlanState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const planStateRef = useRef<PlanState | null>(null);
  planStateRef.current = planState;

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

    // Minute poll / unlock tick: refresh quietly so task cards don't remount.
    const silent = planStateRef.current != null;
    if (!silent) setLoading(true);
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

  const saveTaskNoteOnServer = useCallback(
    async (planDay: number, taskId: string, note: string) => {
      const state = await savePlanTaskNote(planDay, taskId, note);
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
      saveTaskNoteOnServer,
    }),
    [planState, loading, error, refresh, toggleTaskOnServer, saveTaskNoteOnServer],
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

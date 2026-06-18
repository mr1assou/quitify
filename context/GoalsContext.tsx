import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { EMPTY_GOALS_STATE } from "@/constants/goals/emptyGoalsState";
import { useApp } from "@/context/AppContext";
import { fetchGoalsState, setUserGoal } from "@/services/goals/goalsApi";
import type { GoalType, GoalsStateResponse, UserGoal } from "@/types/goals/goal";

type GoalsContextValue = {
  goals: UserGoal[];
  activeGoals: UserGoal[];
  progress: GoalsStateResponse["progress"];
  minTargets: GoalsStateResponse["minTargets"];
  strictMinTargets: boolean;
  isReady: boolean;
  hasOpenGoalSlot: boolean;
  refresh: () => Promise<GoalsStateResponse>;
  setGoal: (type: GoalType, target: number) => Promise<GoalsStateResponse>;
};

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const [goalsState, setGoalsState] = useState<GoalsStateResponse | null>(null);
  const [isReady, setIsReady] = useState(false);

  const canLoadGoals = state.isOnboarded && Boolean(state.account);

  const refresh = useCallback(async () => {
    if (!canLoadGoals) {
      setGoalsState(EMPTY_GOALS_STATE);
      setIsReady(true);
      return EMPTY_GOALS_STATE;
    }

    try {
      const next = await fetchGoalsState();
      setGoalsState(next);
      setIsReady(true);
      return next;
    } catch {
      setGoalsState((current) => current ?? EMPTY_GOALS_STATE);
      setIsReady(true);
      return EMPTY_GOALS_STATE;
    }
  }, [canLoadGoals]);

  useEffect(() => {
    if (!canLoadGoals) {
      setGoalsState(EMPTY_GOALS_STATE);
      setIsReady(true);
      return;
    }

    let cancelled = false;
    setIsReady(false);

    fetchGoalsState()
      .then((next) => {
        if (!cancelled) setGoalsState(next);
      })
      .catch(() => {
        if (!cancelled) setGoalsState(EMPTY_GOALS_STATE);
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [canLoadGoals]);

  const setGoal = useCallback(async (type: GoalType, target: number) => {
    const next = await setUserGoal(type, target);
    setGoalsState(next);
    setIsReady(true);
    return next;
  }, []);

  const activeGoals = useMemo(
    () => goalsState?.goals.filter((goal) => goal.status === "active") ?? [],
    [goalsState?.goals],
  );

  const visibleGoals = useMemo(
    () =>
      goalsState?.goals.filter(
        (goal) => goal.status === "active" || goal.status === "completed",
      ) ?? [],
    [goalsState?.goals],
  );

  const value = useMemo<GoalsContextValue>(
    () => ({
      goals: visibleGoals,
      activeGoals,
      progress: goalsState?.progress ?? EMPTY_GOALS_STATE.progress,
      minTargets: goalsState?.minTargets ?? EMPTY_GOALS_STATE.minTargets,
      strictMinTargets: goalsState?.strictMinTargets ?? EMPTY_GOALS_STATE.strictMinTargets,
      isReady,
      hasOpenGoalSlot: !isReady || activeGoals.length < 3,
      refresh,
      setGoal,
    }),
    [visibleGoals, activeGoals, goalsState, isReady, refresh, setGoal],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
}

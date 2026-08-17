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
import { fetchGoalsState, setUserGoal, deleteUserGoal } from "@/services/goals/goalsApi";
import type { ActiveGoalType, GoalsStateResponse, UserGoal } from "@/types/goals/goal";
import { maxDaysAheadFromStreakDays } from "@/utils/goals/goalStreakProgress";

type GoalsContextValue = {
  goals: UserGoal[];
  activeGoals: UserGoal[];
  progress: GoalsStateResponse["progress"];
  minTargets: GoalsStateResponse["minTargets"];
  maxTargets: GoalsStateResponse["maxTargets"];
  isReady: boolean;
  hasOpenGoalSlot: boolean;
  refresh: () => Promise<GoalsStateResponse>;
  setGoal: (type: ActiveGoalType, target: number) => Promise<GoalsStateResponse>;
  deleteGoal: (goalId: number) => Promise<GoalsStateResponse>;
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

  const setGoal = useCallback(async (type: ActiveGoalType, target: number) => {
    const next = await setUserGoal(type, target);
    setGoalsState(next);
    setIsReady(true);
    return next;
  }, []);

  const deleteGoal = useCallback(async (goalId: number) => {
    const next = await deleteUserGoal(goalId);
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
      maxTargets:
        goalsState?.maxTargets ?? {
          smoke_free_days: maxDaysAheadFromStreakDays(
            goalsState?.progress.smokeFreeDays ?? 0,
          ),
          cigarettes_avoided: null,
        },
      isReady,
      hasOpenGoalSlot:
        isReady &&
        !activeGoals.some((goal) => goal.type === "smoke_free_days"),
      refresh,
      setGoal,
      deleteGoal,
    }),
    [visibleGoals, activeGoals, goalsState, isReady, refresh, setGoal, deleteGoal],
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
}

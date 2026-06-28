import { useCallback, useMemo } from "react";

import { PLAN_PREVIEW_UNLOCK_ALL } from "@/config/plan";
import {
  arePlanTasksComplete,
  getChapterForDay,
  getDayPlan,
} from "@/constants/progress/plan";
import { useApp } from "@/context/AppContext";
import { usePlanState } from "@/hooks/progress/usePlanState";
import type { ResolvedPlanTask } from "@/types";
import { currentMissionDay } from "@/utils/streak";

export function usePlanProgress() {
  const { state } = useApp();
  const { planState, loading, error, refresh, toggleTaskOnServer, saveTaskNoteOnServer } =
    usePlanState();

  const fallbackDay = useMemo(() => {
    if (!state.profile?.streakStart && !state.profile?.quitDate) return 0;
    if (!state.profile) return 0;
    return currentMissionDay(state.profile, Date.now());
  }, [state.profile]);

  const serverCurrentDay = planState?.currentDay ?? 0;
  const serverUnlocked = planState?.unlockedThroughDay ?? 0;

  const currentDay =
    planState != null
      ? serverCurrentDay > 0
        ? serverCurrentDay
        : serverUnlocked > 0
          ? 1
          : 0
      : fallbackDay;

  const unlockedThroughDay = planState != null ? serverUnlocked : fallbackDay;

  const currentChapter = useMemo(
    () => getChapterForDay(currentDay > 0 ? currentDay : 1),
    [currentDay],
  );

  const progressByDay = useMemo(() => {
    const map = new Map<
      number,
      {
        taskStates: Record<string, boolean>;
        taskNotes: Record<string, string>;
        completedAt: string | null;
      }
    >();
    for (const day of planState?.days ?? []) {
      map.set(day.planDay, {
        taskStates: day.taskStates,
        taskNotes: day.taskNotes ?? {},
        completedAt: day.completedAt,
      });
    }
    return map;
  }, [planState?.days]);

  const resolveTasksForDay = useCallback(
    (day: number): ResolvedPlanTask[] => {
      const planDay = getDayPlan(day);
      if (!planDay) return [];

      const saved = progressByDay.get(day);
      const taskStates = saved?.taskStates ?? {};
      const isCompleteDay =
        saved?.completedAt != null ||
        (!PLAN_PREVIEW_UNLOCK_ALL && day < currentDay);

      return planDay.tasks.map((task) => ({
        ...task,
        done: isCompleteDay ? true : (taskStates[task.id] ?? false),
        note: saved?.taskNotes?.[task.id],
      }));
    },
    [progressByDay, currentDay],
  );

  const toggleTask = useCallback(
    async (missionDay: number, taskId: string, value: boolean) => {
      if (PLAN_PREVIEW_UNLOCK_ALL) return;
      await toggleTaskOnServer(missionDay, taskId, value);
    },
    [toggleTaskOnServer],
  );

  const saveTaskNote = useCallback(
    async (missionDay: number, taskId: string, note: string) => {
      if (PLAN_PREVIEW_UNLOCK_ALL) return;
      await saveTaskNoteOnServer(missionDay, taskId, note);
    },
    [saveTaskNoteOnServer],
  );

  const todayTasks = useMemo(
    () => (currentDay > 0 ? resolveTasksForDay(currentDay) : []),
    [resolveTasksForDay, currentDay],
  );

  const todayComplete = arePlanTasksComplete(todayTasks);

  return {
    profile: state.profile,
    currentDay,
    unlockedThroughDay,
    currentChapter,
    resolveTasksForDay,
    toggleTask,
    saveTaskNote,
    todayTasks,
    todayComplete,
    planLoading: loading,
    planError: error,
    refreshPlan: refresh,
  };
}

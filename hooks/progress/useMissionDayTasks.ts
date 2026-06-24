import { useCallback, useMemo, useState } from "react";

import { getDayPlan } from "@/constants/progress/plan";
import { PLAN_PREVIEW_UNLOCK_ALL } from "@/config/plan";
import { usePlanProgress } from "@/hooks/progress/usePlanProgress";
import type { QuitPlanDay, ResolvedPlanTask } from "@/types";

export function useMissionDayTasks(missionDay: number) {
  const {
    currentDay,
    unlockedThroughDay,
    resolveTasksForDay,
    toggleTask: togglePlanTask,
    planLoading,
    planState,
  } = usePlanProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  const dayPlan = useMemo((): QuitPlanDay | null => {
    return getDayPlan(missionDay);
  }, [missionDay]);

  const tasks = useMemo(
    (): ResolvedPlanTask[] => resolveTasksForDay(missionDay),
    [resolveTasksForDay, missionDay],
  );

  const canToggleTasks =
    PLAN_PREVIEW_UNLOCK_ALL || (missionDay === currentDay && currentDay > 0);
  const isLocked = !PLAN_PREVIEW_UNLOCK_ALL && missionDay > unlockedThroughDay;

  const toggleTask = useCallback(
    async (taskId: string, value: boolean) => {
      if (!canToggleTasks || togglingTaskId) return;
      setTogglingTaskId(taskId);
      try {
        await togglePlanTask(missionDay, taskId, value);
      } finally {
        setTogglingTaskId(null);
      }
    },
    [canToggleTasks, togglePlanTask, missionDay, togglingTaskId],
  );

  const goToIndex = useCallback(
    (next: number) => {
      if (tasks.length === 0) return;
      const wrapped = ((next % tasks.length) + tasks.length) % tasks.length;
      setCurrentIndex(wrapped);
    },
    [tasks.length],
  );

  const completedCount = tasks.filter((task) => task.done).length;

  const isTasksReady = PLAN_PREVIEW_UNLOCK_ALL || planState != null;

  return {
    dayPlan,
    tasks,
    currentIndex,
    goToIndex,
    canToggleTasks,
    isLocked,
    unlockedThroughDay,
    toggleTask,
    togglingTaskId,
    planLoading,
    isTasksReady,
    completedCount,
    totalCount: tasks.length,
  };
}

export type MissionDayTasksSession = ReturnType<typeof useMissionDayTasks>;

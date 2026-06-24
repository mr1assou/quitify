import { useMemo } from "react";

import { arePlanTasksComplete, getDayPlan } from "@/constants/progress/plan";
import { usePlanProgress } from "@/hooks/progress/usePlanProgress";
import type { ResolvedPlanTask, TodayMission } from "@/types";

export type { ResolvedPlanTask, TodayMission } from "@/types";

export function useTodayMission(): TodayMission | null {
  const { profile, currentDay, todayTasks, toggleTask } = usePlanProgress();

  return useMemo(() => {
    if (!profile) return null;

    const dayPlan = getDayPlan(currentDay);
    if (!dayPlan) return null;

    const completedCount = todayTasks.filter((task) => task.done).length;
    const totalCount = todayTasks.length;
    const progress = totalCount === 0 ? 0 : completedCount / totalCount;

    return {
      day: currentDay,
      title: dayPlan.title,
      intro: dayPlan.intro,
      tasks: todayTasks,
      completedCount,
      totalCount,
      progress,
      isComplete: arePlanTasksComplete(todayTasks),
      toggleTask: (taskId: string, value: boolean) =>
        toggleTask(currentDay, taskId, value),
    };
  }, [profile, currentDay, todayTasks, toggleTask]);
}

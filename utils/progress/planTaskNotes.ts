import type { PlanState } from "@/types/plan/planState";
import { getDayPlan } from "@/constants/progress/plan";

export type PlanTaskNote = {
  planDay: number;
  dayTitle: string;
  taskId: string;
  taskTitle: string;
  note: string;
};

export function collectPlanTaskNotes(planState: PlanState | null): PlanTaskNote[] {
  const notes: PlanTaskNote[] = [];

  for (const day of planState?.days ?? []) {
    const dayPlan = getDayPlan(day.planDay);
    if (!dayPlan) continue;

    for (const [taskId, note] of Object.entries(day.taskNotes ?? {})) {
      const trimmed = note.trim();
      if (!trimmed) continue;

      const task = dayPlan.tasks.find((item) => item.id === taskId);
      notes.push({
        planDay: day.planDay,
        dayTitle: dayPlan.title,
        taskId,
        taskTitle: task?.title ?? "Task",
        note: trimmed,
      });
    }
  }

  return notes.sort((a, b) => b.planDay - a.planDay);
}

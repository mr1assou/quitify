import type { MissionLog, QuitPlanDay, ResolvedPlanTask } from "@/types";
import { dayKey } from "@/utils/shared/dates";

import {
  getActiveDayPlan,
  getActiveChapterForDay,
  getActivePlanTotalDays,
  getActiveQuitPlan,
} from "@/i18n/content/quitPlanStore";

export const PLAN_TOTAL_DAYS = 180;

export function getPlanTotalDays(): number {
  return getActivePlanTotalDays();
}

/** @deprecated Use getQuitPlanSnapshot() for locale-aware plan data */
export function getQuitPlanLegacyExport() {
  return getActiveQuitPlan();
}

export function getDayPlan(day: number): QuitPlanDay | null {
  return getActiveDayPlan(day);
}

export function getChapterForDay(day: number) {
  return getActiveChapterForDay(day);
}

export function missionPlanLabel(day: number, t?: (key: string, params?: Record<string, string | number>) => string): string {
  if (t) return t("missions.dayTitle", { day: String(day) });
  return `Your plan for Day ${day}`;
}

export function resolvePlanTasks(
  day: number,
  currentDay: number,
  missionLogs: Record<string, MissionLog>,
  nowMs: number,
): ResolvedPlanTask[] {
  const planDay = getDayPlan(day);
  if (!planDay) return [];

  if (day < currentDay) {
    return planDay.tasks.map((task) => ({ ...task, done: true }));
  }

  if (day > currentDay) {
    return planDay.tasks.map((task) => ({ ...task, done: false }));
  }

  const log = missionLogs[dayKey(nowMs)];
  const taskStates = log?.missionDay === day ? log.taskStates : {};

  return planDay.tasks.map((task) => ({
    ...task,
    done: taskStates[task.id] ?? false,
  }));
}

export function arePlanTasksComplete(tasks: readonly ResolvedPlanTask[]): boolean {
  return tasks.length > 0 && tasks.every((task) => task.done);
}

export { getActiveQuitPlan as getQuitPlanSnapshot };

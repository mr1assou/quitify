import planData from "@/constants/progress/quit-plan.json";
import type { MissionLog, QuitPlan, QuitPlanChapter, QuitPlanDay, ResolvedPlanTask } from "@/types";
import { dayKey } from "@/utils/shared/dates";

export const QUIT_PLAN = planData as QuitPlan;

export const PLAN_TOTAL_DAYS = QUIT_PLAN.total_days;

const dayByNumber = new Map<number, QuitPlanDay>();

for (const chapter of QUIT_PLAN.chapters) {
  for (const day of chapter.days) {
    dayByNumber.set(day.day, day);
  }
}

export function getDayPlan(day: number): QuitPlanDay | null {
  if (day < 1 || day > PLAN_TOTAL_DAYS) return null;
  return dayByNumber.get(day) ?? null;
}

export function getChapterForDay(day: number): QuitPlanChapter {
  const chapter = QUIT_PLAN.chapters.find(
    (entry) => day >= entry.day_start && day <= entry.day_end,
  );
  if (!chapter) {
    return QUIT_PLAN.chapters[QUIT_PLAN.chapters.length - 1];
  }
  return chapter;
}

export function missionPlanLabel(day: number): string {
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

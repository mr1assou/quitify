import type { QuitPlan, QuitPlanChapter, QuitPlanDay } from "@/types";
import type { AppLocale } from "@/types/i18n/locale";

import { getQuitPlanForLocale } from "./quitPlanCatalog";

let activePlan: QuitPlan = getQuitPlanForLocale("en");
let dayByNumber = buildDayMap(activePlan);

function buildDayMap(plan: QuitPlan): Map<number, QuitPlanDay> {
  const map = new Map<number, QuitPlanDay>();
  for (const chapter of plan.chapters) {
    for (const day of chapter.days) {
      map.set(day.day, day);
    }
  }
  return map;
}

export function setQuitPlanLocale(locale: AppLocale): void {
  activePlan = getQuitPlanForLocale(locale);
  dayByNumber = buildDayMap(activePlan);
}

export function getActiveQuitPlan(): QuitPlan {
  return activePlan;
}

export function getActivePlanTotalDays(): number {
  return activePlan.total_days;
}

export function getActiveDayPlan(day: number): QuitPlanDay | null {
  if (day < 1 || day > activePlan.total_days) return null;
  return dayByNumber.get(day) ?? null;
}

export function getActiveChapterForDay(day: number): QuitPlanChapter {
  const chapter = activePlan.chapters.find(
    (entry) => day >= entry.day_start && day <= entry.day_end,
  );
  if (!chapter) {
    return activePlan.chapters[activePlan.chapters.length - 1];
  }
  return chapter;
}

/** Call once on app boot before plan reads. */
export function initQuitPlanLocale(locale: AppLocale): void {
  setQuitPlanLocale(locale);
}

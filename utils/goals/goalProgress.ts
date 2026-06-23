import type { GoalProgressSnapshot, UserGoal } from "@/types/goals/goal";
import type { DerivedStats } from "@/types";
import { MS_DAY } from "@/utils/streak/elapsedBreakdown";
import {
  baselineElapsedMsFromStorage,
  isSmokeFreeDaysAheadGoalMet,
} from "@/utils/goals/goalStreakProgress";

export type GoalProgress = {
  current: number;
  target: number;
  progress: number;
  isComplete: boolean;
};

export function computeGoalProgress(
  goal: UserGoal,
  snapshot: GoalProgressSnapshot,
): GoalProgress {
  if (goal.type === "smoke_free_days") {
    const elapsedMs = snapshot.elapsedSmokeFreeMs ?? snapshot.smokeFreeDays * MS_DAY;
    const baselineMs = baselineElapsedMsFromStorage(goal.baselineProgress ?? 0);
    const aheadMs = Math.max(0, elapsedMs - baselineMs);
    const targetMs = goal.target * MS_DAY;
    const currentDaysAhead = aheadMs / MS_DAY;

    return {
      current: Math.round(currentDaysAhead * 10) / 10,
      target: goal.target,
      progress: targetMs > 0 ? Math.min(1, aheadMs / targetMs) : 0,
      isComplete:
        isSmokeFreeDaysAheadGoalMet(baselineMs, goal.target, elapsedMs) ||
        goal.status === "completed",
    };
  }

  const current = currentValueForGoal(goal, snapshot);
  const target = goal.target;
  const progress = target > 0 ? Math.min(1, current / target) : 0;

  return {
    current,
    target,
    progress,
    isComplete: current >= target || goal.status === "completed",
  };
}

export function computeGoalProgressFromStats(
  goal: UserGoal,
  stats: DerivedStats,
): GoalProgress {
  return computeGoalProgress(goal, {
    moneySaved: stats.moneySaved,
    smokeFreeDays: stats.streakDays,
    smokeFreeDaysInProgress: stats.streakDays > 0 ? stats.streakDays + 1 : 0,
    cigarettesAvoided: stats.cigarettesAvoided,
    elapsedSmokeFreeMs: stats.streakDays * MS_DAY,
  });
}

export function currentValueForGoalType(
  type: UserGoal["type"],
  snapshot: GoalProgressSnapshot,
): number {
  switch (type) {
    case "money_saved":
      return snapshot.moneySaved;
    case "smoke_free_days":
      return snapshot.smokeFreeDays;
    case "cigarettes_avoided":
      return snapshot.cigarettesAvoided;
  }
}

function currentValueForGoal(goal: UserGoal, snapshot: GoalProgressSnapshot): number {
  return currentValueForGoalType(goal.type, snapshot);
}

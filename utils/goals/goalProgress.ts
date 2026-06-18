import type { GoalProgressSnapshot, UserGoal } from "@/types/goals/goal";
import type { DerivedStats } from "@/types";

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
    cigarettesAvoided: stats.cigarettesAvoided,
  });
}

function currentValueForGoal(goal: UserGoal, snapshot: GoalProgressSnapshot): number {
  switch (goal.type) {
    case "money_saved":
      return snapshot.moneySaved;
    case "smoke_free_days":
      return snapshot.smokeFreeDays;
    case "cigarettes_avoided":
      return snapshot.cigarettesAvoided;
  }
}

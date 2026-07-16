import { GOAL_COMPLETION_BONUS, GOAL_STREAK_FP_PER_DAY } from "@/constants/goals/goalRewards";
import type { ActiveGoalType, GoalType } from "@/types/goals/goal";
import type { GoalEconomics } from "@/utils/goals/goalEconomics";

function headroomDays(
  type: ActiveGoalType,
  target: number,
  baselineProgress: number,
  economics?: GoalEconomics,
): number {
  switch (type) {
    case "smoke_free_days":
      return Math.max(0, Math.floor(target));
    case "cigarettes_avoided": {
      const headroom = Math.max(0, target - baselineProgress);
      if (headroom <= 0) return 0;
      const perDay = Math.max(0, economics?.cigarettesPerDay ?? 0);
      if (perDay <= 0) return 0;
      return Math.floor(headroom / perDay);
    }
  }
}

export function computeGoalCompletionBonus(
  type: ActiveGoalType,
  target: number,
  baselineProgress: number,
  economics?: GoalEconomics,
): number {
  const days = headroomDays(type, target, baselineProgress, economics);
  if (days <= 0) return 0;

  return days * GOAL_COMPLETION_BONUS.FP_PER_DAY;
}

/** @deprecated Legacy goal type — kept for old stats rows only. */
export function goalTypeRewardDetails(type: GoalType): readonly string[] {
  const streak = `You earn ${GOAL_STREAK_FP_PER_DAY} FP for each smoke-free day while working toward this goal.`;
  const bonus = `Goal bonus (one time): ${GOAL_COMPLETION_BONUS.FP_PER_DAY} FP for each smoke-free day ahead when you set the goal.`;

  switch (type) {
    case "smoke_free_days":
      return [streak, bonus];
    case "cigarettes_avoided":
      return [streak, bonus];
    default:
      return [streak];
  }
}

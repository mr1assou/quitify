import { XP_PER_SMOKE_FREE_DAY } from "@/constants/progress/levels";

/** Keep in sync with backend `goal-completion-bonus.ts`. */
export const GOAL_COMPLETION_BONUS = {
  FP_PER_DAY: 10,
} as const;

export const GOAL_STREAK_FP_PER_DAY = XP_PER_SMOKE_FREE_DAY;

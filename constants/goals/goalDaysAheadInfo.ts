import { GOAL_COMPLETION_BONUS } from "@/constants/goals/goalRewards";

const FP_PER_DAY = GOAL_COMPLETION_BONUS.FP_PER_DAY;

export const GOAL_DAYS_AHEAD_INFO = {
  title: "How goals work",
  tiersSection: `Goals are extra smoke-free days you commit to from today. The minimum you can choose depends on your current streak:

0–2 days → at least 1 day ahead
3–13 days → at least 2 days ahead
14–29 days → at least 3 days ahead
30–39 days → at least 4 days ahead
40–49 days → at least 5 days ahead
50+ days → at least 6 days ahead`,
  fpSection: `Freedom Points bonus:
When you achieve your goal, you earn a one-time bonus of ${FP_PER_DAY} FP for each day in your goal. The bonus is added automatically the moment you hit your target.

Example: a 7-day-ahead goal pays 70 FP (${FP_PER_DAY} × 7) when you complete it.`,
  fpExampleForDays: (days: number) =>
    `Your ${days}-day goal will pay ${days * FP_PER_DAY} FP when you achieve it.`,
} as const;

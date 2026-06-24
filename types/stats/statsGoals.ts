import type { GoalType } from "@/types/goals/goal";

export type GoalStatsRow = {
  id: number;
  attemptId: number;
  attemptNumber: number;
  type: GoalType;
  target: number;
  status: string;
  startedAt: string;
  completedAt: string | null;
  failedAt: string | null;
  failedReason: string | null;
};

export type StatsGoalsResponse = {
  currency: string;
  goals: GoalStatsRow[];
};

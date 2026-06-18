export type GoalType = "money_saved" | "smoke_free_days" | "cigarettes_avoided";

const GOAL_TYPES = new Set<string>([
  "money_saved",
  "smoke_free_days",
  "cigarettes_avoided",
]);

export function isGoalType(value: string): value is GoalType {
  return GOAL_TYPES.has(value);
}

export type GoalStatus = "active" | "completed" | "failed";

export type UserGoal = {
  id: number;
  attemptId: number;
  type: GoalType;
  target: number;
  status: GoalStatus;
  startedAt: string;
  completedAt?: string | null;
  failedAt?: string | null;
};

export type GoalProgressSnapshot = {
  moneySaved: number;
  smokeFreeDays: number;
  cigarettesAvoided: number;
};

export type GoalsStateResponse = {
  currency: string;
  progress: GoalProgressSnapshot;
  goals: UserGoal[];
  minTargets: Record<GoalType, number>;
  strictMinTargets: boolean;
};

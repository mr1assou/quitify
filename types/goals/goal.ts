export type ActiveGoalType = "smoke_free_days" | "cigarettes_avoided";

/** Includes legacy `money_saved` goals still stored for older attempts. */
export type GoalType = ActiveGoalType | "money_saved";

const ACTIVE_GOAL_TYPES = new Set<string>(["smoke_free_days", "cigarettes_avoided"]);

const ALL_GOAL_TYPES = new Set<string>([...ACTIVE_GOAL_TYPES, "money_saved"]);

export function isActiveGoalType(value: string): value is ActiveGoalType {
  return ACTIVE_GOAL_TYPES.has(value);
}

/** Route / API guard for creating new goals. */
export function isGoalType(value: string): value is ActiveGoalType {
  return isActiveGoalType(value);
}

export function isKnownGoalType(value: string): value is GoalType {
  return ALL_GOAL_TYPES.has(value);
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
  smokeFreeDaysInProgress: number;
  cigarettesAvoided: number;
};

export type GoalsStateResponse = {
  currency: string;
  progress: GoalProgressSnapshot;
  goals: UserGoal[];
  minTargets: Record<ActiveGoalType, number>;
};

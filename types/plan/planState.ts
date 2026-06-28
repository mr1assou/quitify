export type PlanDayProgressDto = {
  planDay: number;
  taskStates: Record<string, boolean>;
  taskNotes: Record<string, string>;
  completedAt: string | null;
};

export type PlanState = {
  streakStart: string | null;
  currentDay: number;
  unlockedThroughDay: number;
  totalDays: number;
  days: PlanDayProgressDto[];
};

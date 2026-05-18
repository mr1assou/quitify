export type StreakStats = {
  streakDays: number;
  streakHours: number;
  daysSinceQuit: number;
  cigarettesAvoided: number;
  moneySaved: number;
  minutesReclaimed: number;
  /** Estimated life regained from cigarettes not smoked (minutes). */
  lifeMinutesGained: number;
};

export type DerivedStats = StreakStats;

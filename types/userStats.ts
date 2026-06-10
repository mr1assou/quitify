export type StatsFilterRange = "7d" | "30d" | "90d" | "lifetime";

export type StatsEconomics = {
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packCost: number;
};

export type StatsImpact = {
  durationSeconds: number;
  cigarettesAvoided: number;
  moneySaved: number;
  lifeMinutesGained: number;
  slipCigarettesSmoked: number;
};

export type CurrentStats = StatsImpact & {
  attemptNumber: number;
  startedAt: string;
  streakStart: string;
  slipCount: number;
};

export type LifetimeStats = StatsImpact & {
  totalAttempts: number;
  completedAttempts: number;
  slipCount: number;
};

export type AttemptStatsRow = StatsImpact & {
  attemptNumber: number;
  startedAt: string;
  endedAt: string | null;
  endOutcome: string | null;
  isActive: boolean;
};

export type SlipStatsRow = {
  slipEventId: number;
  outcome: string;
  cigarettesCount: number;
  loggedAt: string;
  attemptNumber: number | null;
  attemptStartedAt: string | null;
};

export type UserStatsResponse = {
  currency: string;
  /** IANA timezone from the user's profile, e.g. "Europe/Paris". */
  timezone: string;
  /** Smoking economics used for live stat calculations (from the server). */
  economics?: StatsEconomics;
  current: CurrentStats | null;
  lifetime: LifetimeStats;
  attempts: AttemptStatsRow[];
  slips: SlipStatsRow[];
};

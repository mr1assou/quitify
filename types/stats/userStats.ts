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

export type AttemptStatsRow = StatsImpact & {
  attemptNumber: number;
  startedAt: string;
  endedAt: string | null;
  endOutcome: string | null;
  isActive: boolean;
};

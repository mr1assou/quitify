export type CravingOutcome = "resisted" | "lapse" | "relapse";

export type CravingLog = {
  id: string;
  serverId?: number;
  timestamp: number;
  outcome: CravingOutcome;
  cigarettesCount?: number;
  intensity?: 1 | 2 | 3;
  durationMs?: number;
};

export type CravingTip = {
  id: string;
  title: string;
  body: string;
};

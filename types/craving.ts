export type CravingOutcome = "resisted" | "lapse" | "relapse";

export type CravingLog = {
  id: string;
  timestamp: number;
  outcome: CravingOutcome;
  intensity?: 1 | 2 | 3;
  durationMs?: number;
};

export type CravingTip = {
  id: string;
  title: string;
  body: string;
};

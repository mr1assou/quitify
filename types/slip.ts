export type SlipOutcome = "lapse" | "relapse";

export type SlipSubmitPayload = {
  outcome: SlipOutcome;
  cigarettesCount?: number;
};

export type SlipEventResponse = {
  slipEventId: number;
  outcome: SlipOutcome;
  cigarettesCount?: number;
  streakStart: string;
  quitDate: string;
  previousStreakStart: string;
  closedAttemptId?: number;
  newAttemptId?: number;
  currentAttemptNumber: number;
};

export type SlipUndoResponse = {
  streakStart: string | null;
  quitDate: string | null;
  currentAttemptNumber?: number;
};

import type { SlipSubmitPayload } from "@/types/slip";

export type CravingResultSubmitInput = SlipSubmitPayload | { outcome: "resisted" };

export type CravingResultStage =
  | "ask"
  | "smoked"
  | "count"
  | "done-resisted"
  | "done-lapse"
  | "done-relapse";

export type CravingResultInitialStage = Extract<CravingResultStage, "ask" | "smoked">;

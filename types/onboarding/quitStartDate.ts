import type { QuitStartPreset } from "./onboarding";

/** Shared quit-start fields (onboarding + reset journey). */
export type QuitStartDateDraft = {
  quitStartPreset?: QuitStartPreset;
  quitStartMonth?: number;
  quitStartDay?: number;
  quitStartYear?: number;
  startTimestamp?: number;
};

export type QuitDateApiPayload = {
  quitDatePreset: "Now" | "Custom";
  quitDate?: string;
};

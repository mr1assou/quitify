export type BreathingPhaseId = "inhale" | "hold-in" | "exhale" | "hold-out";

export type BreathingPhase = {
  id: BreathingPhaseId;
  label: string;
  durationMs: number;
  /** Target scale of the breathing circle at the end of this phase (0–1). */
  targetScale: number;
};

/** Box-breathing inspired rhythm: 4 in · 4 hold · 6 out · 2 settle. */
export const BREATHING_PHASES: readonly BreathingPhase[] = [
  { id: "inhale", label: "Breathe in", durationMs: 4000, targetScale: 1 },
  { id: "hold-in", label: "Hold", durationMs: 4000, targetScale: 1 },
  { id: "exhale", label: "Slowly breathe out", durationMs: 6000, targetScale: 0.55 },
  { id: "hold-out", label: "Rest", durationMs: 2000, targetScale: 0.55 },
] as const;

/** Default number of full cycles for a session preview (UI-only). */
export const BREATHING_DEFAULT_CYCLES = 4;

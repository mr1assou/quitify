import type { QuitReasonOption } from "@/types/onboarding/onboarding";

export type { QuitReasonId, QuitReasonOption } from "@/types/onboarding/onboarding";

export const QUIT_REASON_OPTIONS: readonly QuitReasonOption[] = [
  { id: "health", label: "Better health" },
  { id: "family", label: "Family & loved ones" },
  { id: "money", label: "Save money" },
  { id: "freedom", label: "Break the habit" },
  { id: "smell", label: "Fresher breath & clothes" },
  { id: "fitness", label: "More energy & fitness" },
  { id: "longevity", label: "Live longer" },
  { id: "control", label: "Take back control" },
  { id: "example", label: "Set a good example" },
  { id: "sleep", label: "Better sleep" },
  { id: "appearance", label: "Healthier teeth & skin" },
  { id: "calm", label: "Feel calmer day to day" },
] as const;

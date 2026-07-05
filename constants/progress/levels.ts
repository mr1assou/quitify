import type { LevelDefinition } from "@/types/progress/progress";

/**
 * Level ladder. `xpRequired` is the *total* XP needed to enter the level.
 * Add levels here whenever you want a new milestone.
 */
export const LEVELS: readonly LevelDefinition[] = [
  { level: 1, xpRequired: 0, title: "Spark", tier: "starter" },
  { level: 2, xpRequired: 100, title: "Beginner", tier: "starter" },
  { level: 3, xpRequired: 250, title: "Riser", tier: "rising" },
  { level: 4, xpRequired: 500, title: "Steady", tier: "rising" },
  { level: 5, xpRequired: 1_000, title: "Resilient", tier: "strong" },
  { level: 6, xpRequired: 1_750, title: "Champion", tier: "strong" },
  { level: 7, xpRequired: 2_750, title: "Elite", tier: "elite" },
  { level: 8, xpRequired: 4_000, title: "Master", tier: "elite" },
  { level: 9, xpRequired: 6_000, title: "Legend", tier: "legend" },
  { level: 10, xpRequired: 9_000, title: "Icon", tier: "legend" },
];

/** FP awarded per smoke-free day. */
export const XP_PER_SMOKE_FREE_DAY = 3;

/** XP awarded per craving the user resists. */
export const XP_PER_RESISTED_CRAVING = 10;

/** XP awarded per completed mission day. */
export const XP_PER_COMPLETED_MISSION = 50;

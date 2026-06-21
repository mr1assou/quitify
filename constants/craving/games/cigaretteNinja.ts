import type { Ionicons } from "@expo/vector-icons";

export type CigaretteNinjaObjectKind =
  | "cigarette"
  | "vape"
  | "smoke"
  | "golden"
  | "boss";

export type CigaretteNinjaObjectConfig = {
  kind: CigaretteNinjaObjectKind;
  size: number;
  cravingDrain: number;
  score: number;
  health: number;
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
};

/** Session length — 2 minutes 50 seconds. */
export const CIGARETTE_NINJA_DURATION_SEC = 2 * 60 + 50;

export const CIGARETTE_NINJA_DURATION_LABEL = "2:50";

/** Score required to win before time runs out. */
export const CIGARETTE_NINJA_TARGET_SCORE = 1_500;

export const CIGARETTE_NINJA_COMBO_WINDOW_MS = 850;

export const CIGARETTE_NINJA_MIN_SLICE_PX = 20;

/** Fall acceleration (px per 16ms frame, per frame). */
export const CIGARETTE_NINJA_GRAVITY = 0.28;

/** Initial downward speed when objects spawn (px per 16ms frame). */
export const CIGARETTE_NINJA_INITIAL_VY_MIN = 1.15;
export const CIGARETTE_NINJA_INITIAL_VY_MAX = 2.0;

/** Max downward speed (px per 16ms frame) — ~390 px/s at 60fps. */
export const CIGARETTE_NINJA_TERMINAL_VY = 6.5;

export const CIGARETTE_NINJA_SPAWN_INTERVAL_START_MS = 980;
export const CIGARETTE_NINJA_SPAWN_INTERVAL_MIN_MS = 420;

/** Objects dropped together each spawn wave. */
export const CIGARETTE_NINJA_SPAWN_BATCH_MIN = 2;
export const CIGARETTE_NINJA_SPAWN_BATCH_MAX = 3;

export const CIGARETTE_NINJA_MAX_OBJECTS_START = 3;
export const CIGARETTE_NINJA_MAX_OBJECTS_MAX = 10;

export const CIGARETTE_NINJA_GOLDEN_CHANCE = 0.09;
/** Boss appears ~70% through the session. */
export const CIGARETTE_NINJA_BOSS_AT_SEC = Math.round(
  CIGARETTE_NINJA_DURATION_SEC * 0.7,
);

export const CIGARETTE_NINJA_OBJECT_CONFIG: Record<
  CigaretteNinjaObjectKind,
  CigaretteNinjaObjectConfig
> = {
  cigarette: {
    kind: "cigarette",
    size: 92,
    cravingDrain: 4,
    score: 10,
    health: 1,
    label: "Cigarette",
  },
  vape: {
    kind: "vape",
    size: 88,
    cravingDrain: 5,
    score: 12,
    health: 1,
    icon: "hardware-chip-outline",
    label: "Vape",
  },
  smoke: {
    kind: "smoke",
    size: 84,
    cravingDrain: 3,
    score: 8,
    health: 1,
    icon: "cloud-outline",
    label: "Smoke cloud",
  },
  golden: {
    kind: "golden",
    size: 98,
    cravingDrain: 7,
    score: 30,
    health: 1,
    label: "Golden cigarette",
  },
  boss: {
    kind: "boss",
    size: 120,
    cravingDrain: 5,
    score: 25,
    health: 3,
    label: "Boss cigarette",
  },
};

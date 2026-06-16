import type { Ionicons } from "@expo/vector-icons";

export type ReflexTargetKind = "good" | "bad";

export type ReflexTargetType = {
  id: string;
  kind: ReflexTargetKind;
  icon: keyof typeof Ionicons.glyphMap;
  /** Tint for the icon + glow color. */
  color: string;
};

/** Healthy / motivational icons that should be tapped. */
export const REFLEX_GOOD_TARGETS: readonly ReflexTargetType[] = [
  { id: "heart", kind: "good", icon: "heart", color: "#F08FB0" },
  { id: "star", kind: "good", icon: "star", color: "#F4C66A" },
  { id: "lung", kind: "good", icon: "fitness", color: "#79D5B5" },
  { id: "water", kind: "good", icon: "water", color: "#7CC8F2" },
  { id: "sparkles", kind: "good", icon: "sparkles", color: "#A084E8" },
  { id: "trophy", kind: "good", icon: "trophy", color: "#F4B860" },
];

/** Bad icons (cigarettes) — must be avoided. */
export const REFLEX_BAD_TARGETS: readonly ReflexTargetType[] = [
  { id: "cig-1", kind: "bad", icon: "ban", color: "#E25A5A" },
  { id: "cig-2", kind: "bad", icon: "skull", color: "#C25555" },
];

/** How often a new target spawns (ms). */
export const REFLEX_SPAWN_INTERVAL_MS = 650;

/** Max concurrent targets on screen. */
export const REFLEX_MAX_ON_SCREEN = 5;

/** Lifetime of a single target before it auto-disappears (ms). */
export const REFLEX_TARGET_LIFETIME_MS = 1500;

/** Combo window in ms — pop within this to keep your chain alive. */
export const REFLEX_COMBO_WINDOW_MS = 1400;

/** Chance of spawning a bad target (cigarette) instead of a good one. */
export const REFLEX_BAD_CHANCE = 0.22;

/** Target diameter range. */
export const REFLEX_TARGET_SIZE_MIN = 64;
export const REFLEX_TARGET_SIZE_MAX = 92;

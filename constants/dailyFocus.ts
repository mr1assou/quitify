import type { AutoMissionDefinition, SupportMissionDefinition } from "@/types/dailyFocus";

/** Default avoided-cigarettes goal when a user's daily intake is unknown. */
export const DEFAULT_AVOID_TARGET = 10;

/** XP awarded once the user clears every auto mission of the day. */
export const DAILY_BONUS_XP = 50;

export const AUTO_MISSIONS: readonly AutoMissionDefinition[] = [
  {
    id: "smoke-free-today",
    icon: "leaf",
    title: "Stay smoke-free today",
    unitLabel: (target) => `of ${target}h`,
    accent: "primary",
  },
  {
    id: "reach-24h",
    icon: "timer",
    title: "Reach 24 hours clean",
    unitLabel: () => "of 24h",
    accent: "accent",
  },
  {
    id: "avoid-cigarettes",
    icon: "ban",
    title: "Avoid your usual cigarettes",
    unitLabel: (target) => `of ${target} cigs`,
    accent: "alert",
  },
];

export const SUPPORT_MISSIONS: readonly SupportMissionDefinition[] = [
  {
    id: "log-craving",
    icon: "create-outline",
    title: "Log a craving",
    xpPerStep: 5,
    accent: "primary",
  },
  {
    id: "resist-craving",
    icon: "shield-checkmark-outline",
    title: "Resist a craving",
    xpPerStep: 10,
    accent: "accent",
  },
];

/** Per-day cap for support missions. Keeps XP from being grindable. */
export const SUPPORT_CAPS: Record<SupportMissionDefinition["id"], number> = {
  "log-craving": 3,
  "resist-craving": 3,
};

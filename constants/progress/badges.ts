import type { Badge } from "@/types";

export const FIRST_STEP_BADGE_ID = "first-step";

/** @deprecated Use FIRST_STEP_BADGE_ID */
export const AVAILABLE_BADGE_ID = FIRST_STEP_BADGE_ID;

export const FIRST_STEP_REQUIREMENTS = [
  {
    id: "register",
    label: "Join Quitify",
    valueLabel: "Create your account",
  },
  {
    id: "commit",
    label: "Your decision",
    valueLabel: "Choose to quit smoking",
  },
] as const;

export function isFirstStepBadge(badgeId: string): boolean {
  return badgeId === FIRST_STEP_BADGE_ID;
}

export function isBadgeGalleryAvailable(
  badgeId: string,
  earnedBadgeIds: readonly string[] = [],
): boolean {
  const index = BADGES.findIndex((badge) => badge.id === badgeId);
  if (index < 0) return false;

  if (earnedBadgeIds.includes(badgeId)) return true;
  if (index === 0) return true;

  return BADGES.slice(0, index).every((badge) => earnedBadgeIds.includes(badge.id));
}

/** Keep in sync with backend `badge-definitions.ts`. */
export const BADGES: Badge[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "You took the brave decision to quit.",
    daysRequired: 0,
    fpRequired: 0,
    goalsCompletedRequired: 0,
    accent: "bg-secondary",
  },
  {
    id: "rising-quitter",
    name: "Rising Quitter",
    description: "One smoke-free day, your first completed goal, and 15 FP.",
    daysRequired: 1,
    fpRequired: 15,
    goalsCompletedRequired: 1,
    accent: "bg-secondary",
  },
  {
    id: "craving-crusher",
    name: "Craving Crusher",
    description: "Three smoke-free days, two goals, and 35 FP.",
    daysRequired: 3,
    fpRequired: 35,
    goalsCompletedRequired: 2,
    accent: "bg-primary",
  },
  {
    id: "two-weeks-free",
    name: "Two Weeks Free",
    description: "Two weeks smoke-free and four goals completed.",
    daysRequired: 14,
    fpRequired: 700,
    goalsCompletedRequired: 4,
    accent: "bg-primary",
  },
  {
    id: "top-rated",
    name: "Top Rated Quitter",
    description: "A full month smoke-free with six goals completed.",
    daysRequired: 30,
    fpRequired: 1_200,
    goalsCompletedRequired: 6,
    accent: "bg-accent",
  },
  {
    id: "top-rated-plus",
    name: "Top Rated Plus Quitter",
    description: "Two months of consistency and eight goals.",
    daysRequired: 60,
    fpRequired: 2_500,
    goalsCompletedRequired: 8,
    accent: "bg-accent",
  },
  {
    id: "champion",
    name: "Champion",
    description: "Ninety days smoke-free and ten goals completed.",
    daysRequired: 90,
    fpRequired: 4_000,
    goalsCompletedRequired: 10,
    accent: "bg-primary",
    premium: true,
  },
  {
    id: "half-year-hero",
    name: "Half Year Hero",
    description: "Six months smoke-free with fourteen goals.",
    daysRequired: 180,
    fpRequired: 9_000,
    goalsCompletedRequired: 14,
    accent: "bg-accent",
    premium: true,
  },
  {
    id: "year-free",
    name: "Year Free",
    description: "A full year without smoking and eighteen goals.",
    daysRequired: 365,
    fpRequired: 20_000,
    goalsCompletedRequired: 18,
    accent: "bg-accent",
    premium: true,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Five hundred days smoke-free and twenty-two goals.",
    daysRequired: 500,
    fpRequired: 28_000,
    goalsCompletedRequired: 22,
    accent: "bg-primary",
    premium: true,
  },
  {
    id: "two-year-free",
    name: "Two Year Free",
    description: "Two full years without a cigarette.",
    daysRequired: 730,
    fpRequired: 42_000,
    goalsCompletedRequired: 26,
    accent: "bg-secondary",
    premium: true,
  },
  {
    id: "thousand-day-legend",
    name: "Thousand Day Legend",
    description: "One thousand days of freedom and thirty goals.",
    daysRequired: 1000,
    fpRequired: 58_000,
    goalsCompletedRequired: 30,
    accent: "bg-accent",
    premium: true,
  },
];

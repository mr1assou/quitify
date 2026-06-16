import type { Badge } from "@/types";

export const FIRST_STEP_BADGE_ID = "first-step";

/** @deprecated Use FIRST_STEP_BADGE_ID */
export const AVAILABLE_BADGE_ID = FIRST_STEP_BADGE_ID;

/** Motivational requirements — earned by joining and choosing to quit, not streak/FP. */
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

/** Whether a badge can show requirements / progress (earned, First Step, or immediate next tier). */
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

export const BADGES: Badge[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "You took the brave decision to quit.",
    daysRequired: 0,
    fpRequired: 0,
    accent: "bg-secondary",
  },
  {
    id: "rising-quitter",
    name: "Rising Quitter",
    description: "One smoke-free day and 50 Freedom Points.",
    daysRequired: 1,
    fpRequired: 50,
    accent: "bg-secondary",
  },
  {
    id: "craving-crusher",
    name: "Craving Crusher",
    description: "Three smoke-free days.",
    daysRequired: 3,
    fpRequired: 150,
    accent: "bg-primary",
  },
  {
    id: "two-weeks-free",
    name: "Two Weeks Free",
    description: "Two weeks of progress.",
    daysRequired: 14,
    fpRequired: 700,
    accent: "bg-primary",
  },
  {
    id: "top-rated",
    name: "Top Rated Quitter",
    description: "A full month smoke-free.",
    daysRequired: 30,
    fpRequired: 1_200,
    accent: "bg-accent",
  },
  {
    id: "top-rated-plus",
    name: "Top Rated Plus Quitter",
    description: "Two months of consistency.",
    daysRequired: 60,
    fpRequired: 2_500,
    accent: "bg-accent",
  },
  {
    id: "champion",
    name: "Champion",
    description: "Ninety days of freedom.",
    daysRequired: 90,
    fpRequired: 4_000,
    accent: "bg-primary",
    premium: true,
  },
  {
    id: "half-year-hero",
    name: "Half Year Hero",
    description: "Six months smoke-free.",
    daysRequired: 180,
    fpRequired: 9_000,
    accent: "bg-accent",
    premium: true,
  },
  {
    id: "year-free",
    name: "Year Free",
    description: "A full year without smoking.",
    daysRequired: 365,
    fpRequired: 20_000,
    accent: "bg-accent",
    premium: true,
  },
  {
    id: "unstoppable",
    name: "Unstoppable",
    description: "Five hundred days smoke-free.",
    daysRequired: 500,
    fpRequired: 28_000,
    accent: "bg-primary",
    premium: true,
  },
  {
    id: "two-year-free",
    name: "Two Year Free",
    description: "Two full years without a cigarette.",
    daysRequired: 730,
    fpRequired: 42_000,
    accent: "bg-secondary",
    premium: true,
  },
  {
    id: "thousand-day-legend",
    name: "Thousand Day Legend",
    description: "One thousand days of freedom.",
    daysRequired: 1000,
    fpRequired: 58_000,
    accent: "bg-accent",
    premium: true,
  },
];

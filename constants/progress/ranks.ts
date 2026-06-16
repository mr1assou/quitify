import type { RankBand } from "@/types/progress/progress";

/**
 * Synthetic global rank "world" while there's no backend.
 * Each band fires once the user's XP percentile is at or below `topPercent`.
 * Order: most exclusive first.
 */
export const RANK_BANDS: readonly RankBand[] = [
  { topPercent: 0.01, label: "Top 1% worldwide", hint: "An elite few are here." },
  { topPercent: 0.05, label: "Top 5% worldwide", hint: "Very few make it this far." },
  { topPercent: 0.1, label: "Top 10% worldwide", hint: "You are pulling away." },
  { topPercent: 0.2, label: "Top 20% worldwide", hint: "Solidly above average." },
  { topPercent: 0.4, label: "Top 40% worldwide", hint: "Climbing fast." },
  { topPercent: 0.7, label: "Top 70% worldwide", hint: "On the way up." },
  { topPercent: 1, label: "Just getting started", hint: "Earn Freedom points to climb the ranks." },
];

/** Pretend community size used to translate XP into a position. */
export const SYNTHETIC_COMMUNITY_SIZE = 100_000;

/**
 * XP at which a user is treated as "median". Below this they're in the lower
 * half of the synthetic community; above it they accelerate up the ranks.
 */
export const MEDIAN_XP = 600;

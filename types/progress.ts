import type { Badge } from "@/types/badge";

export type LevelTier = "starter" | "rising" | "strong" | "elite" | "legend";

export type LevelDefinition = {
  level: number;
  /** Total XP required to reach this level. */
  xpRequired: number;
  title: string;
  tier: LevelTier;
};

export type Level = LevelDefinition & {
  /** XP earned within this level so far. */
  xpInto: number;
  /** XP needed to span this level (next.xpRequired - this.xpRequired). */
  xpSpan: number;
  /** 0..1 progress within this level. */
  progress: number;
  /** XP needed to reach the next level (0 if max). */
  xpToNext: number;
  next: LevelDefinition | null;
};

export type RankBand = {
  /** Inclusive lower percentile bound (e.g. 0.05 = top 5%). */
  topPercent: number;
  label: string;
  hint: string;
};

export type GlobalRank = {
  /** XP score used for ranking. */
  xp: number;
  /** Resolved band (top X%). */
  band: RankBand;
  /** Approximate position out of `total`. */
  position: number;
  total: number;
};

export type BadgeWithStatus = Badge & {
  unlocked: boolean;
  /** 0..1 overall progress — minimum of streak and FP progress. */
  progress: number;
  /** Days remaining on streak requirement; 0 if met. */
  daysLeft: number;
  /** Freedom Points remaining; 0 if met. */
  fpLeft: number;
  /** 0..1 progress on smoke-free streak. */
  streakProgress: number;
  /** 0..1 progress on Freedom Points. */
  fpProgress: number;
};

export type ProgressSummary = {
  xp: number;
  rank: GlobalRank;
  badges: BadgeWithStatus[];
  unlockedBadges: BadgeWithStatus[];
  /** Highest badge the user has earned. */
  currentBadge: BadgeWithStatus | null;
  nextBadge: BadgeWithStatus | null;
  /** 0..1 progress from current badge toward the next one. */
  currentBadgeProgress: number;
};

import { isFirstStepBadge } from "@/constants/progress/badges";
import type { BadgeWithStatus, ProgressSummary } from "@/types/progress/progress";

export type AchievementBadgeMetric = {
  /** 0..1 progress toward the next badge tier */
  progress: number;
  label: string;
  caption: string;
};

export type AchievementBadgeSummary = {
  badge: AchievementBadgeMetric;
  freedomPoints: number;
  /** Latest earned badge art in the progress ring. */
  currentBadgeId: string;
};

export function progressToPercent(progress: number): number {
  return Math.round(Math.min(1, Math.max(0, progress)) * 100);
}

/**
 * Display progress toward the next badge. Unlock still requires every requirement
 * (see `BadgeWithStatus.progress`); this averages partial credit across them.
 */
export function computeNextBadgeDisplayProgress(nextBadge: BadgeWithStatus): number {
  if (isFirstStepBadge(nextBadge.id)) {
    return nextBadge.progress;
  }

  const { streakProgress, fpProgress, goalsProgress } = nextBadge;
  return (streakProgress + fpProgress + goalsProgress) / 3;
}

/** Badge ring + FP total for the stats screen header. */
export function computeAchievementBadgeSummary(
  summary: ProgressSummary,
): AchievementBadgeSummary {
  const currentBadge = summary.currentBadge;
  // Image + caption must use the same earned badge (no VIP filter).
  const currentBadgeId = currentBadge?.id ?? "first-step";

  return {
    badge: {
      progress: summary.currentBadgeProgress,
      label: "Current badge",
      caption: currentBadge?.name ?? "—",
    },
    freedomPoints: summary.xp,
    currentBadgeId,
  };
}

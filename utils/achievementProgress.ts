import type { ProgressSummary } from "@/types/progress";
import { resolveHighestUnlockedBadgeId } from "@/utils/badges";

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

/** Badge ring + FP total for the stats screen header. */
export function computeAchievementBadgeSummary(
  summary: ProgressSummary,
  isPremium = false,
): AchievementBadgeSummary {
  const badgeProgress = summary.nextBadge?.progress ?? 1;
  const earnedBadgeId = resolveHighestUnlockedBadgeId(summary.badges, isPremium);
  const currentBadge = summary.currentBadge;
  const currentBadgeId = earnedBadgeId ?? "first-step";

  return {
    badge: {
      progress: badgeProgress,
      label: "Current badge",
      caption: currentBadge?.name ?? "—",
    },
    freedomPoints: summary.xp,
    currentBadgeId,
  };
}

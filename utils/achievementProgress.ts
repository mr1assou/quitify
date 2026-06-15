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
  /** Latest badge the user has earned (shown in the rank-tab ring). */
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
  const currentBadgeId =
    resolveHighestUnlockedBadgeId(summary.badges, isPremium) ?? "first-step";
  const currentBadge =
    summary.currentBadge ??
    summary.badges.find((b) => b.id === currentBadgeId) ??
    null;

  return {
    badge: {
      progress: badgeProgress,
      label: "Current badge",
      caption: currentBadge?.name ?? "First Step",
    },
    freedomPoints: summary.xp,
    currentBadgeId,
  };
}

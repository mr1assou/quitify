import type { ProgressSummary } from "@/types/progress";
import { resolveHighestUnlockedBadgeId } from "@/utils/badges";

export type AchievementBadgeMetric = {
  /** 0..1 progress toward the next badge */
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

/** Badge ring + FP total for the Achievement rank tab header. */
export function computeAchievementBadgeSummary(
  summary: ProgressSummary,
  isPremium = false,
): AchievementBadgeSummary {
  const unlocked = summary.unlockedBadges.length;
  const total = summary.badges.length;
  const badgeProgress = summary.nextBadge?.progress ?? 1;
  const currentBadgeId =
    resolveHighestUnlockedBadgeId(summary.badges, isPremium) ?? "first-step";
  const currentBadge = summary.badges.find((b) => b.id === currentBadgeId);

  return {
    badge: {
      progress: badgeProgress,
      label: "Badges",
      caption: summary.nextBadge
        ? `Next: ${summary.nextBadge.name}`
        : currentBadge
          ? `Current: ${currentBadge.name}`
          : `${unlocked} of ${total} earned`,
    },
    freedomPoints: summary.xp,
    currentBadgeId,
  };
}

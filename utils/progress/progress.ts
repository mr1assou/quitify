import { BADGES, isBadgeGalleryAvailable, isFirstStepBadge } from "@/constants/progress/badges";
import { computeNextBadgeDisplayProgress } from "@/utils/progress/achievementProgress";
import { resolveHighestUnlockedBadge } from "@/utils/progress/badges";
import {
  LEVELS,
  XP_PER_COMPLETED_MISSION,
  XP_PER_RESISTED_CRAVING,
  XP_PER_SMOKE_FREE_DAY,
} from "@/constants/progress/levels";
import {
  MEDIAN_XP,
  RANK_BANDS,
  SYNTHETIC_COMMUNITY_SIZE,
} from "@/constants/progress/ranks";
import type {
  Badge,
  BadgeWithStatus,
  GlobalRank,
  Level,
  LevelDefinition,
  ProgressSummary,
} from "@/types";

type XpInputs = {
  smokeFreeDays: number;
  resistedCravings: number;
  completedMissions: number;
};

/**
 * Total XP earned. Pure function — easy to extend with new sources later.
 */
export function computeXp({
  smokeFreeDays,
  resistedCravings,
  completedMissions,
}: XpInputs): number {
  return Math.max(
    0,
    Math.floor(smokeFreeDays) * XP_PER_SMOKE_FREE_DAY +
      Math.max(0, resistedCravings) * XP_PER_RESISTED_CRAVING +
      Math.max(0, completedMissions) * XP_PER_COMPLETED_MISSION,
  );
}

/** Resolve current + next level for the given XP. */
export function resolveLevel(xp: number): Level {
  let current: LevelDefinition = LEVELS[0];
  let next: LevelDefinition | null = null;

  for (let i = 0; i < LEVELS.length; i++) {
    const lvl = LEVELS[i];
    if (xp >= lvl.xpRequired) {
      current = lvl;
      next = LEVELS[i + 1] ?? null;
    } else {
      break;
    }
  }

  const xpInto = Math.max(0, xp - current.xpRequired);
  const xpSpan = next ? next.xpRequired - current.xpRequired : Math.max(1, current.xpRequired);
  const progress = next ? Math.min(1, xpInto / Math.max(1, xpSpan)) : 1;
  const xpToNext = next ? Math.max(0, next.xpRequired - xp) : 0;

  return { ...current, xpInto, xpSpan, progress, next, xpToNext };
}

/**
 * Map XP to a global rank band. Without a backend this is illustrative —
 * replace `synthPercentile` with a server query when you have one.
 */
function synthPercentile(xp: number): number {
  if (xp <= 0) return 1;
  // Logistic-ish curve around MEDIAN_XP, clamped to (0, 1].
  const k = 1 / Math.max(1, MEDIAN_XP);
  const score = 1 / (1 + Math.exp(-k * (xp - MEDIAN_XP)));
  // Higher XP → lower percentile (closer to top 1%).
  return Math.min(1, Math.max(0.01, 1 - score));
}

export function resolveGlobalRank(xp: number): GlobalRank {
  const percentile = synthPercentile(xp);
  const band = RANK_BANDS.find((b) => percentile <= b.topPercent) ?? RANK_BANDS[RANK_BANDS.length - 1];
  const position = Math.max(1, Math.round(percentile * SYNTHETIC_COMMUNITY_SIZE));
  return { xp, band, position, total: SYNTHETIC_COMMUNITY_SIZE };
}

function finalizeBadgeSummary(
  summary: ProgressSummary,
  earnedBadgeIds: string[],
): ProgressSummary {
  const unlockedBadges = summary.badges.filter((b) => b.unlocked);
  const nextBadge =
    summary.badges.find(
      (b) => isBadgeGalleryAvailable(b.id, earnedBadgeIds) && !b.unlocked,
    ) ?? null;
  const currentBadge = resolveHighestUnlockedBadge(summary.badges);
  const currentBadgeProgress = nextBadge ? computeNextBadgeDisplayProgress(nextBadge) : 1;

  return {
    ...summary,
    unlockedBadges,
    currentBadge,
    nextBadge,
    currentBadgeProgress,
  };
}

function firstStepProgress(hasAccount: boolean, hasCommittedToQuit: boolean): number {
  let progress = 0;
  if (hasAccount) progress += 0.5;
  if (hasCommittedToQuit) progress += 0.5;
  return progress;
}

function badgeStatus(
  badge: Badge,
  daysQuit: number,
  fp: number,
  goalsCompleted: number,
  isPremium: boolean,
  earnedBadgeIds: string[],
  hasAccount: boolean,
  hasCommittedToQuit: boolean,
): BadgeWithStatus {
  const unlocked = earnedBadgeIds.includes(badge.id);

  if (unlocked) {
    return {
      ...badge,
      unlocked: true,
      progress: 1,
      daysLeft: 0,
      fpLeft: 0,
      goalsLeft: 0,
      streakProgress: 1,
      fpProgress: 1,
      goalsProgress: 1,
    };
  }

  const galleryOpen = isBadgeGalleryAvailable(badge.id, earnedBadgeIds);

  if (isFirstStepBadge(badge.id)) {
    const progress = firstStepProgress(hasAccount, hasCommittedToQuit);
    return {
      ...badge,
      unlocked: false,
      progress,
      daysLeft: 0,
      fpLeft: 0,
      goalsLeft: 0,
      streakProgress: hasCommittedToQuit ? 1 : 0,
      fpProgress: hasAccount ? 1 : 0,
      goalsProgress: 1,
    };
  }

  if (!galleryOpen || (!isPremium && badge.premium)) {
    return {
      ...badge,
      unlocked: false,
      progress: 0,
      daysLeft: badge.daysRequired,
      fpLeft: badge.fpRequired,
      goalsLeft: badge.goalsCompletedRequired,
      streakProgress: 0,
      fpProgress: 0,
      goalsProgress: 0,
    };
  }

  const streakMet = daysQuit >= badge.daysRequired;
  const fpMet = fp >= badge.fpRequired;
  const goalsMet = goalsCompleted >= badge.goalsCompletedRequired;
  const streakProgress = Math.min(1, Math.max(0, daysQuit / Math.max(1, badge.daysRequired)));
  const fpProgress = Math.min(1, Math.max(0, fp / Math.max(1, badge.fpRequired)));
  const goalsProgress = Math.min(
    1,
    Math.max(0, goalsCompleted / Math.max(1, badge.goalsCompletedRequired)),
  );
  const progress = Math.min(streakProgress, fpProgress, goalsProgress);
  const daysLeft = streakMet ? 0 : Math.max(0, Math.ceil(badge.daysRequired - daysQuit));
  const fpLeft = fpMet ? 0 : Math.max(0, badge.fpRequired - fp);
  const goalsLeft = goalsMet
    ? 0
    : Math.max(0, badge.goalsCompletedRequired - goalsCompleted);

  return {
    ...badge,
    unlocked: false,
    progress,
    daysLeft,
    fpLeft,
    goalsLeft,
    streakProgress,
    fpProgress,
    goalsProgress,
  };
}

export function buildProgressSummary({
  daysQuit,
  isPremium,
  resistedCravings,
  completedMissions,
  earnedBadgeIds,
  freedomPoints,
  goalsCompleted = 0,
  hasAccount = false,
  hasCommittedToQuit = false,
}: {
  daysQuit: number;
  isPremium: boolean;
  resistedCravings: number;
  completedMissions: number;
  earnedBadgeIds: string[];
  freedomPoints?: number;
  goalsCompleted?: number;
  hasAccount?: boolean;
  hasCommittedToQuit?: boolean;
}): ProgressSummary {
  const computedXp = computeXp({ smokeFreeDays: daysQuit, resistedCravings, completedMissions });
  const xp = freedomPoints ?? computedXp;
  const rank = resolveGlobalRank(xp);
  const badges = BADGES.map((b) =>
    badgeStatus(
      b,
      daysQuit,
      xp,
      goalsCompleted,
      isPremium,
      earnedBadgeIds,
      hasAccount,
      hasCommittedToQuit,
    ),
  );

  return finalizeBadgeSummary(
    {
      xp,
      rank,
      badges,
      unlockedBadges: badges.filter((b) => b.unlocked),
      currentBadge: null,
      nextBadge: null,
      currentBadgeProgress: 0,
    },
    earnedBadgeIds,
  );
}

import { BADGES } from "@/constants/badges";
import {
  LEVELS,
  XP_PER_COMPLETED_MISSION,
  XP_PER_RESISTED_CRAVING,
  XP_PER_SMOKE_FREE_DAY,
} from "@/constants/levels";
import {
  MEDIAN_XP,
  RANK_BANDS,
  SYNTHETIC_COMMUNITY_SIZE,
} from "@/constants/ranks";
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

/** Demo: all badges through Champion (90 days) are earned. */
const DEMO_MAX_UNLOCKED_DAYS = 90;
const DEMO_NEXT_BADGE_ID = "half-year-hero";
/** Smoke-free days for next-badge progress (past Champion, toward Half Year Hero). */
const DEMO_DAYS_QUIT = 120;

/**
 * Demo badge state until streak-driven unlocks are wired for QA.
 * User has Champion; next target is Half Year Hero.
 */
function applyDemoBadgeState(summary: ProgressSummary): ProgressSummary {
  const badges = summary.badges.map((badge) => {
    if (badge.daysRequired <= DEMO_MAX_UNLOCKED_DAYS) {
      return { ...badge, unlocked: true, progress: 1, daysLeft: 0 };
    }

    if (badge.id === DEMO_NEXT_BADGE_ID) {
      const progress = Math.min(1, DEMO_DAYS_QUIT / Math.max(1, badge.daysRequired));
      return {
        ...badge,
        unlocked: false,
        progress,
        daysLeft: Math.max(0, badge.daysRequired - DEMO_DAYS_QUIT),
      };
    }

    return {
      ...badge,
      unlocked: false,
      progress: 0,
      daysLeft: badge.daysRequired,
    };
  });

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const nextBadge = badges.find((b) => b.id === DEMO_NEXT_BADGE_ID) ?? null;

  return { ...summary, badges, unlockedBadges, nextBadge };
}

function badgeStatus(badge: Badge, daysQuit: number, isPremium: boolean): BadgeWithStatus {
  const visible = isPremium || !badge.premium;
  const reached = visible && daysQuit >= badge.daysRequired;
  const progress = visible
    ? Math.min(1, Math.max(0, daysQuit / Math.max(1, badge.daysRequired)))
    : 0;
  const daysLeft = reached ? 0 : Math.max(0, Math.ceil(badge.daysRequired - daysQuit));
  return { ...badge, unlocked: reached, progress, daysLeft };
}

export function buildProgressSummary({
  daysQuit,
  isPremium,
  resistedCravings,
  completedMissions,
}: {
  daysQuit: number;
  isPremium: boolean;
  resistedCravings: number;
  completedMissions: number;
}): ProgressSummary {
  const xp = computeXp({ smokeFreeDays: daysQuit, resistedCravings, completedMissions });
  const rank = resolveGlobalRank(xp);
  const badges = BADGES.map((b) => badgeStatus(b, daysQuit, isPremium));
  const unlocked = badges.filter((b) => b.unlocked);
  const nextBadge = badges.find((b) => !b.unlocked) ?? null;

  return applyDemoBadgeState({
    xp,
    rank,
    badges,
    unlockedBadges: unlocked,
    nextBadge,
  });
}

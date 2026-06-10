import { MINUTES_LIFE_PER_CIGARETTE_AVOIDED } from "@/constants/health";
import type {
  AttemptStatsRow,
  SlipStatsRow,
  StatsEconomics,
  StatsFilterRange,
  StatsImpact,
} from "@/types/userStats";
import { MS_DAY } from "@/utils/time/ms";

function windowStartMs(range: StatsFilterRange, now: number): number | null {
  if (range === "lifetime") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return now - days * MS_DAY;
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function sumImpact(a: StatsImpact, b: StatsImpact): StatsImpact {
  return {
    durationSeconds: a.durationSeconds + b.durationSeconds,
    cigarettesAvoided: a.cigarettesAvoided + b.cigarettesAvoided,
    moneySaved: a.moneySaved + b.moneySaved,
    lifeMinutesGained: a.lifeMinutesGained + b.lifeMinutesGained,
    slipCigarettesSmoked: a.slipCigarettesSmoked + b.slipCigarettesSmoked,
  };
}

const EMPTY_IMPACT: StatsImpact = {
  durationSeconds: 0,
  cigarettesAvoided: 0,
  moneySaved: 0,
  lifeMinutesGained: 0,
  slipCigarettesSmoked: 0,
};

function attemptImpactFromRow(attempt: AttemptStatsRow): StatsImpact {
  return {
    durationSeconds: attempt.durationSeconds,
    cigarettesAvoided: attempt.cigarettesAvoided,
    moneySaved: attempt.moneySaved,
    lifeMinutesGained: attempt.lifeMinutesGained,
    slipCigarettesSmoked: attempt.slipCigarettesSmoked,
  };
}

function slipCigarettesInPeriod(
  slips: SlipStatsRow[],
  periodStart: number,
  periodEnd: number,
): number {
  return slips
    .filter((slip) => {
      const loggedAt = Date.parse(slip.loggedAt);
      return loggedAt >= periodStart && loggedAt <= periodEnd;
    })
    .reduce((sum, slip) => sum + slip.cigarettesCount, 0);
}

function computeSegmentImpact(
  economics: StatsEconomics,
  segmentStartMs: number,
  segmentEndMs: number,
  slipCigarettes: number,
): StatsImpact {
  const durationMs = Math.max(0, segmentEndMs - segmentStartMs);
  const durationSeconds = Math.floor(durationMs / 1000);
  const gross = (Math.max(0, economics.cigarettesPerDay) * durationMs) / MS_DAY;
  const avoided = Math.max(0, Math.floor(gross) - Math.max(0, slipCigarettes));
  const perPack = Math.max(1, economics.cigarettesPerPack);

  return {
    durationSeconds,
    cigarettesAvoided: avoided,
    moneySaved: (avoided / perPack) * economics.packCost,
    lifeMinutesGained: avoided * MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
    slipCigarettesSmoked: Math.max(0, slipCigarettes),
  };
}

/**
 * Impact for one attempt clipped to a filter window.
 * Completed attempts use their stored snapshot when the full attempt is visible.
 * Active attempts (and partial windows) are recomputed live with server economics.
 */
function impactForAttemptSegment(
  attempt: AttemptStatsRow,
  slips: SlipStatsRow[],
  economics: StatsEconomics,
  windowStart: number | null,
  now: number,
): StatsImpact {
  const attemptStart = Date.parse(attempt.startedAt);
  const attemptEnd = attempt.endedAt ? Date.parse(attempt.endedAt) : now;

  if (windowStart !== null && !rangesOverlap(windowStart, now, attemptStart, attemptEnd)) {
    return EMPTY_IMPACT;
  }

  const segmentStart = windowStart === null ? attemptStart : Math.max(windowStart, attemptStart);
  const segmentEnd = Math.min(now, attemptEnd);

  if (segmentStart >= segmentEnd) return EMPTY_IMPACT;

  const coversFullAttempt = segmentStart <= attemptStart && segmentEnd >= attemptEnd;

  if (attempt.endedAt !== null && coversFullAttempt) {
    return attemptImpactFromRow(attempt);
  }

  const slipCigarettes = slipCigarettesInPeriod(slips, segmentStart, segmentEnd);
  return computeSegmentImpact(economics, segmentStart, segmentEnd, slipCigarettes);
}

export function computeOverviewForRange(
  attempts: AttemptStatsRow[],
  slips: SlipStatsRow[],
  economics: StatsEconomics,
  range: StatsFilterRange,
  now = Date.now(),
): StatsImpact {
  const windowStart = windowStartMs(range, now);

  return attempts.reduce(
    (total, attempt) =>
      sumImpact(total, impactForAttemptSegment(attempt, slips, economics, windowStart, now)),
    EMPTY_IMPACT,
  );
}

export function filterSlipsByRange(
  slips: SlipStatsRow[],
  range: StatsFilterRange,
  now = Date.now(),
): SlipStatsRow[] {
  const windowStart = windowStartMs(range, now);
  if (windowStart === null) return slips;

  return slips.filter((slip) => Date.parse(slip.loggedAt) >= windowStart);
}

export function filterAttemptsByRange(
  attempts: AttemptStatsRow[],
  slips: SlipStatsRow[],
  economics: StatsEconomics,
  range: StatsFilterRange,
  now = Date.now(),
): AttemptStatsRow[] {
  if (range === "lifetime") return attempts;

  const windowStart = windowStartMs(range, now);
  if (windowStart === null) return attempts;

  return attempts
    .filter((attempt) => {
      const attemptStart = Date.parse(attempt.startedAt);
      const attemptEnd = attempt.endedAt ? Date.parse(attempt.endedAt) : now;
      return rangesOverlap(windowStart, now, attemptStart, attemptEnd);
    })
    .map((attempt) => ({
      ...attempt,
      ...impactForAttemptSegment(attempt, slips, economics, windowStart, now),
    }));
}

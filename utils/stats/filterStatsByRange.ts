import { MINUTES_LIFE_PER_CIGARETTE_AVOIDED } from "@/constants/progress/health";
import type {
  AttemptStatsRow,
  StatsEconomics,
  StatsFilterRange,
  StatsImpact,
} from "@/types/stats/userStats";
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

function slipCigarettesForSegment(
  attempt: AttemptStatsRow,
  segmentStart: number,
  segmentEnd: number,
  now: number,
): number {
  const attemptStart = Date.parse(attempt.startedAt);
  const attemptEnd = attempt.endedAt ? Date.parse(attempt.endedAt) : now;
  const attemptDuration = Math.max(1, attemptEnd - attemptStart);
  const segmentDuration = Math.max(0, segmentEnd - segmentStart);

  return Math.round(
    attempt.slipCigarettesSmoked * (segmentDuration / attemptDuration),
  );
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
  const avoided = Math.max(0, gross - Math.max(0, slipCigarettes));
  const perPack = Math.max(1, economics.cigarettesPerPack);

  return {
    durationSeconds,
    cigarettesAvoided: avoided,
    moneySaved: (avoided / perPack) * economics.packCost,
    lifeMinutesGained: avoided * MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
    slipCigarettesSmoked: Math.max(0, slipCigarettes),
  };
}

function impactForAttemptSegment(
  attempt: AttemptStatsRow,
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

  const slipCigarettes = slipCigarettesForSegment(attempt, segmentStart, segmentEnd, now);
  return computeSegmentImpact(economics, segmentStart, segmentEnd, slipCigarettes);
}

export function filterAttemptsByRange(
  attempts: AttemptStatsRow[],
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
      ...impactForAttemptSegment(attempt, economics, windowStart, now),
    }));
}

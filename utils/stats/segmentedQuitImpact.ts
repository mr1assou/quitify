import {
  MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
  MINUTES_RECLAIMED_PER_CIGARETTE,
} from "@/constants/progress/health";
import type { HabitEconomicsSegment } from "@/types/profile/habitEconomics";
import { MS_DAY } from "@/utils/time/ms";

import type { QuitImpact } from "./quitImpact";

type Segment = {
  effectiveFromMs: number;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPrice: number;
};

function parsePackPrice(value: string | undefined): number {
  if (!value?.trim()) return 0;
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapSegments(segments: HabitEconomicsSegment[]): Segment[] {
  return segments
    .map((segment) => ({
      effectiveFromMs: Date.parse(segment.effectiveFrom),
      cigarettesPerDay: segment.cigarettesPerDay,
      cigarettesPerPack: segment.cigarettesPerPack,
      packPrice: parsePackPrice(segment.packPrice),
    }))
    .filter((segment) => Number.isFinite(segment.effectiveFromMs))
    .sort((a, b) => a.effectiveFromMs - b.effectiveFromMs);
}

function impactForWindow(
  cigarettesPerDay: number,
  cigarettesPerPack: number,
  packPrice: number,
  windowMs: number,
  slipCigarettes: number,
): QuitImpact {
  const gross = (Math.max(0, cigarettesPerDay) * windowMs) / MS_DAY;
  const avoided = Math.max(0, gross - Math.max(0, slipCigarettes));
  const perPack = Math.max(1, cigarettesPerPack);
  const moneySaved = (avoided / perPack) * packPrice;

  return {
    cigarettesAvoided: avoided,
    moneySaved,
    minutesReclaimed: avoided * MINUTES_RECLAIMED_PER_CIGARETTE,
    lifeMinutesGained: avoided * MINUTES_LIFE_PER_CIGARETTE_AVOIDED,
  };
}

function sumImpact(a: QuitImpact, b: QuitImpact): QuitImpact {
  return {
    cigarettesAvoided: a.cigarettesAvoided + b.cigarettesAvoided,
    moneySaved: a.moneySaved + b.moneySaved,
    minutesReclaimed: a.minutesReclaimed + b.minutesReclaimed,
    lifeMinutesGained: a.lifeMinutesGained + b.lifeMinutesGained,
  };
}

/** Matches backend segment math — old habit windows stay frozen. */
export function computeSegmentedQuitImpact(input: {
  segments: HabitEconomicsSegment[];
  timelineStartMs: number;
  timelineEndMs: number;
  slipCigarettesTotal?: number;
}): QuitImpact {
  const { timelineStartMs, timelineEndMs } = input;
  const totalMs = timelineEndMs - timelineStartMs;
  if (totalMs <= 0) {
    return {
      cigarettesAvoided: 0,
      moneySaved: 0,
      minutesReclaimed: 0,
      lifeMinutesGained: 0,
    };
  }

  const mapped = mapSegments(input.segments);
  if (mapped.length === 0) {
    return {
      cigarettesAvoided: 0,
      moneySaved: 0,
      minutesReclaimed: 0,
      lifeMinutesGained: 0,
    };
  }

  const totalSlips = Math.max(0, input.slipCigarettesTotal ?? 0);
  let total = {
    cigarettesAvoided: 0,
    moneySaved: 0,
    minutesReclaimed: 0,
    lifeMinutesGained: 0,
  };

  for (let index = 0; index < mapped.length; index += 1) {
    const segment = mapped[index];
    const segmentStartMs = Math.max(timelineStartMs, segment.effectiveFromMs);
    const segmentEndMs = Math.min(
      timelineEndMs,
      mapped[index + 1]?.effectiveFromMs ?? timelineEndMs,
    );
    const windowMs = segmentEndMs - segmentStartMs;
    if (windowMs <= 0) continue;

    const slipShare = Math.round(totalSlips * (windowMs / totalMs));
    total = sumImpact(
      total,
      impactForWindow(
        segment.cigarettesPerDay,
        segment.cigarettesPerPack,
        segment.packPrice,
        windowMs,
        slipShare,
      ),
    );
  }

  return total;
}

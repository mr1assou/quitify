import type { OnboardingDraft } from "@/types";
import type { QuitStartPreset } from "@/types/onboarding";
import { clampDayToMonth, startOfLocalDay } from "@/utils/dates";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type QuitStartYmd = {
  year: number;
  month: number;
  day: number;
};

/** Valid calendar date on or after today (local midnight). */
export function parseQuitStartYmd(
  y: number,
  m: number,
  d: number,
  now = Date.now(),
): number | null {
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31
  ) {
    return null;
  }
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  dt.setHours(0, 0, 0, 0);
  const todayStart = startOfLocalDay(now);
  if (dt.getTime() < todayStart) return null;
  return dt.getTime();
}

export function quitStartTimestampForNow(now = Date.now()): number {
  return startOfLocalDay(now);
}

export function quitStartTimestampForTomorrow(now = Date.now()): number {
  return startOfLocalDay(now + MS_PER_DAY);
}

export function hasFullCustomQuitYmd(draft: OnboardingDraft): boolean {
  return (
    draft.quitStartMonth != null &&
    draft.quitStartDay != null &&
    draft.quitStartYear != null
  );
}

export function customQuitTimestampFromDraft(
  draft: OnboardingDraft,
): number | null {
  if (!hasFullCustomQuitYmd(draft)) return null;
  return parseQuitStartYmd(
    draft.quitStartYear!,
    draft.quitStartMonth!,
    draft.quitStartDay!,
  );
}

/** Draft patch when the user picks Now / Tomorrow / Custom preset. */
export function quitStartPatchForPreset(
  preset: QuitStartPreset,
): Partial<OnboardingDraft> {
  if (preset === "now") {
    return {
      quitStartPreset: preset,
      startTimestamp: quitStartTimestampForNow(),
      quitStartMonth: undefined,
      quitStartDay: undefined,
      quitStartYear: undefined,
    };
  }
  if (preset === "tomorrow") {
    return {
      quitStartPreset: preset,
      startTimestamp: quitStartTimestampForTomorrow(),
      quitStartMonth: undefined,
      quitStartDay: undefined,
      quitStartYear: undefined,
    };
  }
  return { quitStartPreset: preset };
}

/** Merge YMD parts with optional `startTimestamp` when the date is valid. */
export function quitStartPatchForCustomYmd(
  ymd: Partial<QuitStartYmd>,
  current: OnboardingDraft,
): Partial<OnboardingDraft> {
  const month = ymd.month ?? current.quitStartMonth;
  const year = ymd.year ?? current.quitStartYear;
  let day = ymd.day ?? current.quitStartDay;
  if (month != null && day != null) {
    day = clampDayToMonth(day, month, year);
  }
  const patch: Partial<OnboardingDraft> = {
    quitStartMonth: month,
    quitStartDay: day,
    quitStartYear: year,
  };
  if (month != null && day != null && year != null) {
    const ts = parseQuitStartYmd(year, month, day);
    if (ts != null) patch.startTimestamp = ts;
  }
  return patch;
}

/** Step 5 — quit start date (now / tomorrow / custom). */
export function isQuitDateComplete(draft: OnboardingDraft): boolean {
  if (!draft.quitStartPreset) return false;
  if (draft.quitStartPreset === "now" || draft.quitStartPreset === "tomorrow") {
    return Number.isFinite(draft.startTimestamp);
  }
  return customQuitTimestampFromDraft(draft) != null;
}

/** Step 6 — cold turkey vs gradual. */
export function isQuitMethodComplete(draft: OnboardingDraft): boolean {
  return draft.quitMethod != null;
}

export function isQuitPlanComplete(draft: OnboardingDraft): boolean {
  return isQuitDateComplete(draft) && isQuitMethodComplete(draft);
}

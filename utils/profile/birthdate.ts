/** Allowed age range for profile birthday (inclusive, full calendar years). */
export const MIN_PROFILE_AGE_YEARS = 5;
export const MAX_PROFILE_AGE_YEARS = 120;

const MIN_AGE_YEARS = MIN_PROFILE_AGE_YEARS;
const MAX_AGE_YEARS = MAX_PROFILE_AGE_YEARS;

function ageInFullYears(birthMs: number, now = new Date()): number {
  const b = new Date(birthMs);
  let age = now.getFullYear() - b.getFullYear();
  const md = now.getMonth() - b.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < b.getDate())) {
    age -= 1;
  }
  return age;
}

/** Valid calendar date; returned time is local start of that day. */
export function parseBirthYmd(y: number, m: number, d: number): number | null {
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(m) ||
    !Number.isFinite(d) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31 ||
    y < 1900
  ) {
    return null;
  }
  const now = new Date();
  const thisYear = now.getFullYear();
  if (y > thisYear) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  dt.setHours(0, 0, 0, 0);
  if (dt.getTime() > now.getTime()) return null;
  const age = ageInFullYears(dt.getTime(), now);
  if (age < MIN_AGE_YEARS || age > MAX_AGE_YEARS) return null;
  return dt.getTime();
}

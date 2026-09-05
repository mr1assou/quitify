/** A lapse is always logged as a single cigarette. */
export const LAPSE_CIGARETTE_COUNT = 1;

/** Relapse requires an approximate count — at least two cigarettes. */
export const RELAPSE_MIN_CIGARETTE_COUNT = 2;

export function parseRelapseCigaretteCount(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const value = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(value)) return null;

  return value;
}

export function isValidRelapseCigaretteCount(count: number | null): count is number {
  return (
    count != null &&
    Number.isInteger(count) &&
    count >= RELAPSE_MIN_CIGARETTE_COUNT
  );
}

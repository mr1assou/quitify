/** Parses a positive decimal from free-text input (empty → undefined). */
export function parseOptionalPositiveDecimal(raw: string): number | undefined {
  const t = raw.trim().replace(",", ".");
  if (!t.length) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n * 10_000) / 10_000;
}

/** Parses a non-negative decimal from free-text input (empty → undefined). */
export function parseOptionalNonNegativeDecimal(raw: string): number | undefined {
  const t = raw.trim().replace(",", ".");
  if (!t.length) return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.round(n * 10_000) / 10_000;
}

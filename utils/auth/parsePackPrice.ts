/** Extracts a numeric pack price from stored display text (e.g. "DH 12.50"). */
export function parsePackPrice(text?: string | null): number {
  if (!text?.trim()) return 0;
  const normalized = text.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

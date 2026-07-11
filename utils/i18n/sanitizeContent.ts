/** Normalize punctuation that reads like machine-generated copy. */
export function sanitizeContentPunctuation(text: string): string {
  return text
    .replace(/\s*—\s*/g, ". ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/\s*--\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function localizedCardText(
  overlay: { texts: Record<string, string> },
  id: number | string,
  fallback: string,
): string {
  const translated = overlay.texts[String(id)];
  if (!translated) return sanitizeContentPunctuation(fallback);
  return sanitizeContentPunctuation(translated);
}

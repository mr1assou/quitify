/** e.g. "Jan 2024" (or "janv. 2024" in French) from account creation time. */
export function formatMemberSinceLabel(dateMs: number, locale?: string): string {
  const date = new Date(dateMs);
  if (!Number.isFinite(date.getTime())) return "";

  return date.toLocaleDateString(locale ?? "en-US", {
    month: "short",
    year: "numeric",
  });
}

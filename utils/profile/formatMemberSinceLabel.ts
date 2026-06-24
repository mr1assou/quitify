/** e.g. "Jan 2024" from account creation time. */
export function formatMemberSinceLabel(dateMs: number): string {
  const date = new Date(dateMs);
  if (!Number.isFinite(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

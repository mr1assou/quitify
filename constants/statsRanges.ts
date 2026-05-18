import type { RangeOption, StatsRange } from "@/types/statsDashboard";

export const RANGE_OPTIONS: readonly RangeOption[] = [
  { id: "7d", label: "7 days", buckets: 7 },
  { id: "30d", label: "30 days", buckets: 30 },
  { id: "90d", label: "90 days", buckets: 90 },
];

/** Human label for the savings chart subtitle. */
export function rangeWindowLabel(id: StatsRange): string {
  const opt = RANGE_OPTIONS.find((r) => r.id === id);
  return opt ? `Last ${opt.buckets} days` : "";
}

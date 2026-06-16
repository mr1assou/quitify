import type { RangeOption, StatsRange } from "@/types/stats/statsDashboard";
import type { StatsFilterRange } from "@/types/stats/userStats";

export const RANGE_OPTIONS: readonly RangeOption[] = [
  { id: "7d", label: "7 days", buckets: 7 },
  { id: "30d", label: "30 days", buckets: 30 },
  { id: "90d", label: "90 days", buckets: 90 },
];

export const STATS_FILTER_OPTIONS: readonly { id: StatsFilterRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "lifetime", label: "Lifetime" },
];

/** Human label for the savings chart subtitle. */
export function rangeWindowLabel(id: StatsRange): string {
  const opt = RANGE_OPTIONS.find((r) => r.id === id);
  return opt ? `Last ${opt.buckets} days` : "";
}

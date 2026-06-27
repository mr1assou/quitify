import type { FreedomPointLedgerRow } from "@/types/stats/statsFreedomPoints";

const SMOKE_FREE_DAY = "smoke_free_day";
const GOAL_COMPLETION = "goal_completion";

/** Human-readable label for a ledger entry source. */
export function freedomPointSourceLabel(row: FreedomPointLedgerRow): string {
  switch (row.sourceType) {
    case SMOKE_FREE_DAY: {
      const dayPart = row.sourceKey.split(":")[1];
      const day = Number(dayPart);
      if (Number.isFinite(day) && day > 0) {
        return `Smoke-free day ${day}`;
      }
      return "Smoke-free day streak";
    }
    case GOAL_COMPLETION:
      return "Goal completion bonus";
    default:
      return "Freedom points";
  }
}

/** Short subtitle clarifying the earn rule. */
export function freedomPointSourceDescription(row: FreedomPointLedgerRow): string {
  switch (row.sourceType) {
    case SMOKE_FREE_DAY:
      return "Daily streak reward";
    case GOAL_COMPLETION:
      return "One-time goal bonus";
    default:
      return "Reward";
  }
}

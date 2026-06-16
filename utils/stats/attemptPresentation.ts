import type { AttemptStatsRow } from "@/types/stats/userStats";
import {
  formatCurrency,
  formatDuration,
  formatLifeGained,
  formatNumber,
} from "@/utils/shared/format";
import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";

export type AttemptDetailRow = {
  label: string;
  value: string;
};

export function attemptOutcomeLabel(row: AttemptStatsRow): string {
  if (row.isActive) return "Active";
  if (row.endOutcome === "lapse") return "Lapse";
  if (row.endOutcome === "relapse") return "Relapse";
  return "Ended";
}

export function attemptEndedDescription(row: AttemptStatsRow): string | null {
  if (row.isActive) return null;
  if (row.endOutcome === "lapse") return "Ended after a lapse";
  if (row.endOutcome === "relapse") return "Ended after a relapse";
  return "Attempt closed";
}

export function buildAttemptDetailRows(
  row: AttemptStatsRow,
  currency: string,
  timeZone: string,
): AttemptDetailRow[] {
  const smokeFreeHours = row.durationSeconds / 3600;

  const rows: AttemptDetailRow[] = [
    {
      label: "Started",
      value: formatUtcIsoInTimezone(row.startedAt, timeZone),
    },
    {
      label: "Ended",
      value: row.endedAt
        ? formatUtcIsoInTimezone(row.endedAt, timeZone)
        : "In progress",
    },
    {
      label: "Smoke-free time",
      value: formatDuration(smokeFreeHours),
    },
    {
      label: "Cigarettes avoided",
      value: formatNumber(row.cigarettesAvoided),
    },
    {
      label: "Money saved",
      value: formatCurrency(row.moneySaved, currency),
    },
    {
      label: "Life gained",
      value: formatLifeGained(row.lifeMinutesGained),
    },
    {
      label: "Cigarettes smoked on slips",
      value: formatNumber(row.slipCigarettesSmoked),
    },
  ];

  const endedDescription = attemptEndedDescription(row);
  if (endedDescription) {
    rows.push({ label: "Outcome", value: endedDescription });
  }

  return rows;
}

export function formatAttemptDateRange(row: AttemptStatsRow, timeZone: string): string {
  const start = formatUtcIsoInTimezone(row.startedAt, timeZone);
  if (!row.endedAt) return `${start} – In progress`;
  return `${start} – ${formatUtcIsoInTimezone(row.endedAt, timeZone)}`;
}

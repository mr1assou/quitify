import type { SlipStatsRow } from "@/types/userStats";
import { formatNumber } from "@/utils/format";
import { formatUtcDateInTimezone } from "@/utils/time/formatInTimezone";

export type SlipDetailRow = {
  label: string;
  value: string;
};

export function slipOutcomeLabel(outcome: string): string {
  if (outcome === "lapse") return "Lapse";
  if (outcome === "relapse") return "Relapse";
  return "Slip";
}

export function buildSlipDetailRows(slip: SlipStatsRow, timeZone: string): SlipDetailRow[] {
  const rows: SlipDetailRow[] = [
    {
      label: "Logged at",
      value: formatUtcDateInTimezone(slip.loggedAt, timeZone),
    },
    {
      label: "Type",
      value: slipOutcomeLabel(slip.outcome),
    },
    {
      label: "Cigarettes smoked",
      value: formatNumber(slip.cigarettesCount),
    },
  ];

  if (slip.attemptNumber != null) {
    rows.push({
      label: "Attempt ended",
      value: `Attempt ${slip.attemptNumber}`,
    });
  }

  if (slip.attemptStartedAt) {
    rows.push({
      label: "Attempt started",
      value: formatUtcDateInTimezone(slip.attemptStartedAt, timeZone),
    });
  }

  return rows;
}

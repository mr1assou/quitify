import type { GoalStatsRow } from "@/types/stats/statsGoals";
import { formatGoalTitle } from "@/utils/goals/goalLabels";
import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";

export function goalStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function formatGoalStatsTimeline(row: GoalStatsRow, timeZone: string): string {
  const started = formatUtcIsoInTimezone(row.startedAt, timeZone);

  if (row.completedAt) {
    return `${started} · Completed ${formatUtcIsoInTimezone(row.completedAt, timeZone)}`;
  }

  if (row.failedAt) {
    return `${started} · Failed ${formatUtcIsoInTimezone(row.failedAt, timeZone)}`;
  }

  return `${started} · In progress`;
}

export function formatGoalStatsTitle(
  row: GoalStatsRow,
  currency: string,
): string {
  return formatGoalTitle(
    {
      id: row.id,
      attemptId: row.attemptId,
      type: row.type,
      target: row.target,
      status: row.status as "active" | "completed" | "failed",
      startedAt: row.startedAt,
      completedAt: row.completedAt,
      failedAt: row.failedAt,
    },
    currency,
  );
}

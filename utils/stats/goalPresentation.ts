import type { GoalStatsRow } from "@/types/stats/statsGoals";
import type { TranslationParams } from "@/types/i18n/locale";
import type { TranslationKey } from "@/i18n/translate";
import { computeGoalCompletionBonus } from "@/utils/goals/goalCompletionBonus";
import { formatSmokeFreeGoalEndDate } from "@/utils/goals/goalEndDate";
import { formatNumber } from "@/utils/shared/format";
import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";

type Translate = (key: TranslationKey, params?: TranslationParams) => string;

export type GoalDetailRow = {
  label: string;
  value: string;
};

export function goalStatusLabel(status: string, t: Translate): string {
  switch (status) {
    case "active":
      return t("stats.active");
    case "completed":
      return t("stats.completed");
    case "failed":
      return t("stats.failed");
    default:
      return status;
  }
}

export function formatGoalStatsTimeline(
  row: GoalStatsRow,
  timeZone: string,
  t: Translate,
): string {
  const started = formatUtcIsoInTimezone(row.startedAt, timeZone);
  const ends =
    row.status === "active" && row.type === "smoke_free_days"
      ? formatSmokeFreeGoalEndDate(row.startedAt, row.target, timeZone)
      : null;

  if (row.completedAt) {
    return t("stats.timelineCompleted", {
      started,
      at: formatUtcIsoInTimezone(row.completedAt, timeZone),
    });
  }

  if (row.failedAt) {
    return t("stats.timelineFailed", {
      started,
      at: formatUtcIsoInTimezone(row.failedAt, timeZone),
    });
  }

  if (ends) {
    return t("stats.timelineInProgressEnds", { started, ends });
  }

  return t("stats.timelineInProgress", { started });
}

export function formatGoalStatsTitle(
  row: GoalStatsRow,
  currency: string,
  t: Translate,
): string {
  switch (row.type) {
    case "money_saved":
      return t("stats.goalTitleMoney", { amount: `${currency}${formatNumber(row.target)}` });
    case "smoke_free_days":
      return row.target === 1
        ? t("stats.goalTitleSmokeFreeDay", { count: row.target })
        : t("stats.goalTitleSmokeFreeDays", { count: row.target });
    case "cigarettes_avoided":
      return t("stats.goalTitleCigarettes", { count: formatNumber(row.target) });
    default:
      return String(row.type);
  }
}

export function buildGoalDetailRows(
  row: GoalStatsRow,
  _currency: string,
  timeZone: string,
  t: Translate,
): GoalDetailRow[] {
  const rows: GoalDetailRow[] = [
    {
      label: t("stats.started"),
      value: formatUtcIsoInTimezone(row.startedAt, timeZone),
    },
  ];

  if (row.completedAt) {
    rows.push({
      label: t("stats.completed"),
      value: formatUtcIsoInTimezone(row.completedAt, timeZone),
    });
  } else if (row.failedAt) {
    rows.push({
      label: t("stats.failed"),
      value: formatUtcIsoInTimezone(row.failedAt, timeZone),
    });
  } else if (row.type === "smoke_free_days") {
    const ends = formatSmokeFreeGoalEndDate(row.startedAt, row.target, timeZone);
    rows.push({
      label: t("stats.goalTargetEnd"),
      value: ends ?? t("stats.inProgress"),
    });
  } else {
    rows.push({
      label: t("stats.endedLabel"),
      value: t("stats.inProgress"),
    });
  }

  rows.push({
    label: t("stats.goalAttempt"),
    value: t("stats.attemptNumber", { n: row.attemptNumber }),
  });

  rows.push({
    label: t("stats.outcome"),
    value: goalStatusLabel(row.status, t),
  });

  if (row.status === "failed") {
    rows.push({
      label: t("stats.failedReason"),
      value:
        row.failedReason === "slip"
          ? t("stats.failedReasonSlip")
          : (row.failedReason ?? t("stats.failed")),
    });
  }

  if (row.status === "completed" && row.type === "smoke_free_days") {
    const bonus = computeGoalCompletionBonus("smoke_free_days", row.target, 0);
    if (bonus > 0) {
      rows.push({
        label: t("stats.goalCompletionBonus"),
        value: t("stats.fpAmount", { amount: bonus }),
      });
    }
  }

  return rows;
}

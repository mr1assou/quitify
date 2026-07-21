import type { GoalStatsRow } from "@/types/stats/statsGoals";
import type { TranslationParams } from "@/types/i18n/locale";
import type { TranslationKey } from "@/i18n/translate";
import { formatSmokeFreeGoalEndDate } from "@/utils/goals/goalEndDate";
import { formatNumber } from "@/utils/shared/format";
import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";

type Translate = (key: TranslationKey, params?: TranslationParams) => string;

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

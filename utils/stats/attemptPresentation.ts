import type { AttemptStatsRow } from "@/types/stats/userStats";
import type { TranslationParams } from "@/types/i18n/locale";
import type { TranslationKey } from "@/i18n/translate";
import {
  formatCurrency,
  formatDuration,
  formatLifeGained,
  formatNumber,
} from "@/utils/shared/format";
import { formatStreakDuration } from "@/utils/streak";
import { formatUtcIsoInTimezone } from "@/utils/time/formatInTimezone";

export type AttemptDetailRow = {
  label: string;
  value: string;
};

type Translate = (key: TranslationKey, params?: TranslationParams) => string;

export function attemptOutcomeLabel(row: AttemptStatsRow, t: Translate): string {
  if (row.isActive) return t("stats.active");
  if (row.endOutcome === "lapse") return t("stats.lapse");
  if (row.endOutcome === "relapse") return t("stats.relapse");
  return t("stats.ended");
}

export function attemptEndedDescription(row: AttemptStatsRow, t: Translate): string | null {
  if (row.isActive) return null;
  if (row.endOutcome === "lapse") return t("stats.endedAfterLapse");
  if (row.endOutcome === "relapse") return t("stats.endedAfterRelapse");
  return t("stats.attemptClosed");
}

export function buildAttemptDetailRows(
  row: AttemptStatsRow,
  currency: string,
  timeZone: string,
  t: Translate,
): AttemptDetailRow[] {
  const smokeFreeHours = row.durationSeconds / 3600;
  const smokeFreeDisplay =
    row.durationSeconds < 3600
      ? formatStreakDuration(row.durationSeconds * 1000)
      : formatDuration(smokeFreeHours);

  const rows: AttemptDetailRow[] = [
    {
      label: t("stats.started"),
      value: formatUtcIsoInTimezone(row.startedAt, timeZone),
    },
    {
      label: t("stats.endedLabel"),
      value: row.endedAt
        ? formatUtcIsoInTimezone(row.endedAt, timeZone)
        : t("stats.inProgress"),
    },
    {
      label: t("stats.smokeFreeTime"),
      value: smokeFreeDisplay,
    },
    {
      label: t("stats.cigarettesAvoided"),
      value: formatNumber(row.cigarettesAvoided),
    },
    {
      label: t("stats.moneySaved"),
      value: formatCurrency(row.moneySaved, currency),
    },
    {
      label: t("stats.lifeGained"),
      value: formatLifeGained(row.lifeMinutesGained),
    },
    {
      label: t("stats.cigarettesSmokedOnSlips"),
      value: formatNumber(row.slipCigarettesSmoked),
    },
  ];

  const endedDescription = attemptEndedDescription(row, t);
  if (endedDescription) {
    rows.push({ label: t("stats.outcome"), value: endedDescription });
  }

  return rows;
}

export function formatAttemptDateRange(
  row: AttemptStatsRow,
  timeZone: string,
  t: Translate,
): string {
  const start = formatUtcIsoInTimezone(row.startedAt, timeZone);
  if (!row.endedAt) return t("stats.dateRangeInProgress", { start });
  return `${start} – ${formatUtcIsoInTimezone(row.endedAt, timeZone)}`;
}

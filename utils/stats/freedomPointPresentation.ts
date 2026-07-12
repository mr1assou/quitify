import type { FreedomPointLedgerRow } from "@/types/stats/statsFreedomPoints";
import type { TranslationParams } from "@/types/i18n/locale";
import type { TranslationKey } from "@/i18n/translate";

const SMOKE_FREE_DAY = "smoke_free_day";
const GOAL_COMPLETION = "goal_completion";

type Translate = (key: TranslationKey, params?: TranslationParams) => string;

/** Human-readable label for a ledger entry source. */
export function freedomPointSourceLabel(row: FreedomPointLedgerRow, t: Translate): string {
  switch (row.sourceType) {
    case SMOKE_FREE_DAY: {
      const dayPart = row.sourceKey.split(":")[1];
      const day = Number(dayPart);
      if (Number.isFinite(day) && day > 0) {
        return t("stats.smokeFreeDayN", { day });
      }
      return t("stats.smokeFreeDayStreak");
    }
    case GOAL_COMPLETION:
      return t("stats.goalCompletionBonus");
    default:
      return t("stats.freedomPoints");
  }
}

/** Short subtitle clarifying the earn rule. */
export function freedomPointSourceDescription(row: FreedomPointLedgerRow, t: Translate): string {
  switch (row.sourceType) {
    case SMOKE_FREE_DAY:
      return t("stats.dailyStreakReward");
    case GOAL_COMPLETION:
      return t("stats.oneTimeGoalBonus");
    default:
      return t("stats.reward");
  }
}

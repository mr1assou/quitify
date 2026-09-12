import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import type { AppLocale } from "@/types/i18n/locale";

/** Resolves saved card ids to quotes, preserving the saved order. */
export function resolveSavedQuotes(
  section: SavedCardsSection,
  ids: readonly string[],
  locale: AppLocale,
): MotivationQuote[] {
  if (ids.length === 0) return [];

  if (section === "tips") {
    const { buildTipQuotesByIds } =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@/i18n/content/buildTipQuotes") as typeof import("@/i18n/content/buildTipQuotes");
    return buildTipQuotesByIds(locale, ids);
  }

  const { buildMotivationQuotesByIds } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/i18n/content/buildMotivationQuotes") as typeof import("@/i18n/content/buildMotivationQuotes");
  return buildMotivationQuotesByIds(locale, ids);
}

import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { buildMotivationQuotes } from "@/i18n/content/buildMotivationQuotes";
import { buildTipQuotes } from "@/i18n/content/buildTipQuotes";
import type { AppLocale } from "@/types/i18n/locale";

function catalogForSection(section: SavedCardsSection, locale: AppLocale) {
  const quotes = section === "tips" ? buildTipQuotes(locale) : buildMotivationQuotes(locale);
  return new Map(quotes.map((quote) => [quote.id, quote]));
}

/** Resolves saved card ids to quotes, preserving the saved order. */
export function resolveSavedQuotes(
  section: SavedCardsSection,
  ids: readonly string[],
  locale: AppLocale,
): MotivationQuote[] {
  const catalog = catalogForSection(section, locale);
  return ids
    .map((id) => catalog.get(id))
    .filter((quote): quote is MotivationQuote => quote != null);
}

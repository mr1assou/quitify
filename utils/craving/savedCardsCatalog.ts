import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { MOTIVATION_QUOTES } from "@/constants/craving/motivationQuotes";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { TIP_QUOTES } from "@/constants/craving/tipQuotes";

const TIPS_BY_ID = new Map(TIP_QUOTES.map((quote) => [quote.id, quote]));
const MOTIVATION_BY_ID = new Map(
  MOTIVATION_QUOTES.map((quote) => [quote.id, quote]),
);

function catalogForSection(section: SavedCardsSection) {
  return section === "tips" ? TIPS_BY_ID : MOTIVATION_BY_ID;
}

/** Resolves saved card ids to quotes, preserving the saved order. */
export function resolveSavedQuotes(
  section: SavedCardsSection,
  ids: readonly string[],
): MotivationQuote[] {
  const catalog = catalogForSection(section);
  return ids
    .map((id) => catalog.get(id))
    .filter((quote): quote is MotivationQuote => quote != null);
}

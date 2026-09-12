import { ALL_MOTIVATIONAL_CARDS } from "@/constants/craving/motivationalCards";
import {
  MOTIVATION_CATEGORY_PALETTES,
  type MotivationCardCategory,
} from "@/constants/craving/motivationCardPalettes";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { getMotivationCardOverlay } from "@/i18n/content/motivationCardOverlays";
import type { AppLocale } from "@/types/i18n/locale";
import { localizedCardText } from "@/utils/i18n/sanitizeContent";

const DEFAULT_PALETTE = MOTIVATION_CATEGORY_PALETTES["Health & Body"];

function paletteForCategory(category: string) {
  return (
    MOTIVATION_CATEGORY_PALETTES[category as MotivationCardCategory] ??
    DEFAULT_PALETTE
  );
}

function toQuote(
  card: (typeof ALL_MOTIVATIONAL_CARDS)[number],
  overlay: ReturnType<typeof getMotivationCardOverlay>,
): MotivationQuote {
  return {
    id: String(card.id),
    text: localizedCardText(overlay, card.id, card.text),
    palette: paletteForCategory(card.category),
  };
}

export function buildMotivationQuotes(
  locale: AppLocale,
): readonly MotivationQuote[] {
  const overlay = getMotivationCardOverlay(locale);
  return ALL_MOTIVATIONAL_CARDS.map((card) => toQuote(card, overlay));
}

/** Build only the motivation quotes needed for saved ids (preserves id order). */
export function buildMotivationQuotesByIds(
  locale: AppLocale,
  ids: readonly string[],
): MotivationQuote[] {
  if (ids.length === 0) return [];
  const overlay = getMotivationCardOverlay(locale);
  const want = new Set(ids);
  const byId = new Map<string, MotivationQuote>();
  for (const card of ALL_MOTIVATIONAL_CARDS) {
    const id = String(card.id);
    if (!want.has(id)) continue;
    byId.set(id, toQuote(card, overlay));
    if (byId.size === want.size) break;
  }
  return ids
    .map((id) => byId.get(id))
    .filter((quote): quote is MotivationQuote => quote != null);
}

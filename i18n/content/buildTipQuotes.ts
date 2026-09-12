import { ALL_TIP_CARDS } from "@/constants/craving/tipCards";
import {
  TIP_CATEGORY_PALETTES,
  type TipCardCategory,
} from "@/constants/craving/tipCardPalettes";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { getTipCardOverlay } from "@/i18n/content/tipCardOverlays";
import type { AppLocale } from "@/types/i18n/locale";
import { localizedCardText } from "@/utils/i18n/sanitizeContent";

const DEFAULT_PALETTE = TIP_CATEGORY_PALETTES["Beat the Craving"];

function paletteForCategory(category: string) {
  return TIP_CATEGORY_PALETTES[category as TipCardCategory] ?? DEFAULT_PALETTE;
}

function toQuote(
  card: (typeof ALL_TIP_CARDS)[number],
  overlay: ReturnType<typeof getTipCardOverlay>,
): MotivationQuote {
  return {
    id: String(card.id),
    text: localizedCardText(overlay, card.id, card.text),
    palette: paletteForCategory(card.category),
  };
}

export function buildTipQuotes(locale: AppLocale): readonly MotivationQuote[] {
  const overlay = getTipCardOverlay(locale);
  return ALL_TIP_CARDS.map((card) => toQuote(card, overlay));
}

/** Build only the tip quotes needed for saved ids (preserves id order). */
export function buildTipQuotesByIds(
  locale: AppLocale,
  ids: readonly string[],
): MotivationQuote[] {
  if (ids.length === 0) return [];
  const overlay = getTipCardOverlay(locale);
  const want = new Set(ids);
  const byId = new Map<string, MotivationQuote>();
  for (const card of ALL_TIP_CARDS) {
    const id = String(card.id);
    if (!want.has(id)) continue;
    byId.set(id, toQuote(card, overlay));
    if (byId.size === want.size) break;
  }
  return ids
    .map((id) => byId.get(id))
    .filter((quote): quote is MotivationQuote => quote != null);
}

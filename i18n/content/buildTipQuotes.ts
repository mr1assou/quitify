import { ALL_TIP_CARDS } from "@/constants/craving/tipCards";
import {
  TIP_CATEGORY_PALETTES,
  type TipCardCategory,
} from "@/constants/craving/tipCardPalettes";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { getCardOverlay } from "@/i18n/content/cardOverlays";
import type { AppLocale } from "@/types/i18n/locale";
import { localizedCardText } from "@/utils/i18n/sanitizeContent";

const DEFAULT_PALETTE = TIP_CATEGORY_PALETTES["Beat the Craving"];

function paletteForCategory(category: string) {
  return TIP_CATEGORY_PALETTES[category as TipCardCategory] ?? DEFAULT_PALETTE;
}

export function buildTipQuotes(locale: AppLocale): readonly MotivationQuote[] {
  const overlay = getCardOverlay("tips", locale);

  return ALL_TIP_CARDS.map((card) => ({
    id: String(card.id),
    text: localizedCardText(overlay, card.id, card.text),
    palette: paletteForCategory(card.category),
  }));
}

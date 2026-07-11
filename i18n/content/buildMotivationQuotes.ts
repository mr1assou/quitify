import { ALL_MOTIVATIONAL_CARDS } from "@/constants/craving/motivationalCards";
import {
  MOTIVATION_CATEGORY_PALETTES,
  type MotivationCardCategory,
} from "@/constants/craving/motivationCardPalettes";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import { getCardOverlay } from "@/i18n/content/cardOverlays";
import type { AppLocale } from "@/types/i18n/locale";
import { localizedCardText } from "@/utils/i18n/sanitizeContent";

const DEFAULT_PALETTE = MOTIVATION_CATEGORY_PALETTES["Health & Body"];

function paletteForCategory(category: string) {
  return (
    MOTIVATION_CATEGORY_PALETTES[category as MotivationCardCategory] ??
    DEFAULT_PALETTE
  );
}

export function buildMotivationQuotes(locale: AppLocale): readonly MotivationQuote[] {
  const overlay = getCardOverlay("motivation", locale);

  return ALL_MOTIVATIONAL_CARDS.map((card) => ({
    id: String(card.id),
    text: localizedCardText(overlay, card.id, card.text),
    palette: paletteForCategory(card.category),
  }));
}

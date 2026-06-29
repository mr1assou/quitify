import { ALL_MOTIVATIONAL_CARDS } from "./motivationalCards";
import {
  MOTIVATION_CATEGORY_PALETTES,
  type MotivationCardCategory,
} from "./motivationCardPalettes";
import type { MotivationQuote } from "./motivationCardTypes";

export type { MotivationCardPalette, MotivationQuote } from "./motivationCardTypes";
export type { MotivationCard } from "./motivationalCards";

const DEFAULT_PALETTE = MOTIVATION_CATEGORY_PALETTES["Health & Body"];

function paletteForCategory(category: string) {
  return (
    MOTIVATION_CATEGORY_PALETTES[category as MotivationCardCategory] ??
    DEFAULT_PALETTE
  );
}

function toMotivationQuote(
  card: (typeof ALL_MOTIVATIONAL_CARDS)[number],
): MotivationQuote {
  return {
    id: String(card.id),
    text: card.text,
    palette: paletteForCategory(card.category),
  };
}

export const MOTIVATION_QUOTES: readonly MotivationQuote[] =
  ALL_MOTIVATIONAL_CARDS.map(toMotivationQuote);

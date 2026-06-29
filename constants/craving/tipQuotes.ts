import { ALL_TIP_CARDS } from "./tipCards";
import {
  TIP_CATEGORY_PALETTES,
  type TipCardCategory,
} from "./tipCardPalettes";
import type { MotivationQuote } from "./motivationCardTypes";

export type { TipCard } from "./tipCards";
export type { TipCardCategory } from "./tipCardPalettes";

const DEFAULT_PALETTE = TIP_CATEGORY_PALETTES["Beat the Craving"];

function paletteForCategory(category: string) {
  return (
    TIP_CATEGORY_PALETTES[category as TipCardCategory] ?? DEFAULT_PALETTE
  );
}

function toTipQuote(card: (typeof ALL_TIP_CARDS)[number]): MotivationQuote {
  return {
    id: String(card.id),
    text: card.text,
    palette: paletteForCategory(card.category),
  };
}

export const TIP_QUOTES: readonly MotivationQuote[] =
  ALL_TIP_CARDS.map(toTipQuote);

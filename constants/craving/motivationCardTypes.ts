export type MotivationCardPalette = {
  /** Top color of the card gradient. */
  gradientTop: string;
  /** Bottom color of the card gradient. */
  gradientBottom: string;
  /** Body text color. */
  text: string;
  /** Author / footer text color. */
  muted: string;
  /** Accent for the small decorative shape. */
  accent: string;
};

export type MotivationQuote = {
  id: string;
  text: string;
  author?: string;
  palette: MotivationCardPalette;
};

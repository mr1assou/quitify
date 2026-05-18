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

export const MOTIVATION_QUOTES: readonly MotivationQuote[] = [
  {
    id: "stronger",
    text: "You are stronger than the urge. Every minute you wait, you win.",
    author: "Quitify",
    palette: {
      gradientTop: "#FFB58A",
      gradientBottom: "#E87B4F",
      text: "#1A1209",
      muted: "#1A120999",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "future-you",
    text: "Future you is watching this moment — and so proud you held on.",
    palette: {
      gradientTop: "#8FB7FF",
      gradientBottom: "#4A78DC",
      text: "#0B1531",
      muted: "#0B153199",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "five-minutes",
    text: "Most cravings fade in under 5 minutes. Breathe through it.",
    author: "Science of habits",
    palette: {
      gradientTop: "#B5E8B5",
      gradientBottom: "#5BB07C",
      text: "#0F2117",
      muted: "#0F211799",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "smaller-each-time",
    text: "Every craving you resist makes the next one smaller.",
    palette: {
      gradientTop: "#D5B8FF",
      gradientBottom: "#8E63D6",
      text: "#160B2D",
      muted: "#160B2D99",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "didnt-come-this-far",
    text: "You didn’t come this far to only come this far.",
    palette: {
      gradientTop: "#FFC8D6",
      gradientBottom: "#E55C82",
      text: "#240914",
      muted: "#24091499",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "one-more-breath",
    text: "Just one more breath. Just one more minute. You’ve got this.",
    palette: {
      gradientTop: "#9CE6E6",
      gradientBottom: "#3C9D9D",
      text: "#062323",
      muted: "#06232399",
      accent: "#FFFFFF66",
    },
  },
  {
    id: "loud-but-louder",
    text: "The urge is loud — but you’re louder.",
    palette: {
      gradientTop: "#FFE48A",
      gradientBottom: "#E0A23C",
      text: "#231806",
      muted: "#23180699",
      accent: "#FFFFFF66",
    },
  },
] as const;

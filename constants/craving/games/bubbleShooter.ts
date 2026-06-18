/** Bubble colors rendered on the board (indices into `BUBBLE_SHOOTER_PALETTE`). */
export const BUBBLE_SHOOTER_COLOR_COUNT = 5;

export type BubblePaletteEntry = {
  /** Main bubble body color. */
  fill: string;
  /** Darker edge for depth and separation. */
  shade: string;
  /** Subtle outer ring so neighbors don't bleed together. */
  stroke: string;
};

/** High-contrast, saturated palette tuned for light and dark play fields. */
export const BUBBLE_SHOOTER_PALETTE: readonly BubblePaletteEntry[] = [
  { fill: "#FF4D6D", shade: "#D72648", stroke: "#9E1835" },
  { fill: "#00B4FF", shade: "#008FCC", stroke: "#006999" },
  { fill: "#FFD000", shade: "#D4A800", stroke: "#9A7A00" },
  { fill: "#A855F7", shade: "#7C3AED", stroke: "#5B21B6" },
  { fill: "#22C55E", shade: "#16A34A", stroke: "#15803D" },
] as const;

/** Even rows use this many columns; odd rows use one fewer (staggered hex grid). */
export const BUBBLE_SHOOTER_COLS_EVEN = 8;

export const BUBBLE_SHOOTER_INITIAL_ROWS = 5;

/** Total bubbles to pop across the whole session. */
export const BUBBLE_SHOOTER_TOTAL_BUBBLES = 2000;

/** Visible rows spawned per batch while bubbles remain in the pool. */
export const BUBBLE_SHOOTER_BATCH_ROWS = 5;

/** Chance a grid cell is filled when building a batch. */
export const BUBBLE_SHOOTER_BATCH_DENSITY = 0.88;

/** Horizontal padding inside the play field when computing bubble radius. */
export const BUBBLE_SHOOTER_GRID_PADDING = 12;

/** Minimum connected bubbles to pop a cluster. */
export const BUBBLE_SHOOTER_MATCH_MIN = 3;

/** A bubble at or below this row triggers a loss. */
export const BUBBLE_SHOOTER_DANGER_ROW = 11;

/** After this many landed shots, the ceiling drops one row. */
export const BUBBLE_SHOOTER_SHOTS_BETWEEN_PUSH = 6;

/** Projectile travel speed in px/ms. */
export const BUBBLE_SHOOTER_PROJECTILE_SPEED = 0.65;

/** Points per popped bubble (matches + falling orphans). */
export const BUBBLE_SHOOTER_POINTS_PER_BUBBLE = 10;

/** Bonus per orphan cluster bubble. */
export const BUBBLE_SHOOTER_ORPHAN_BONUS = 5;

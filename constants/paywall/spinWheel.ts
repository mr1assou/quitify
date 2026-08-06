/** Spin-wheel segments — all percentages; pointer always lands on the win index (29%). */
export const SPIN_WHEEL_WIN_INDEX = 0;

export const SPIN_WHEEL_SEGMENT_IDS = [
  "win",
  "a",
  "b",
  "c",
  "d",
  "e",
] as const;

/** Display labels; index 0 is the guaranteed win (greatest %). */
export const SPIN_WHEEL_PERCENT_LABELS = [
  "29% OFF",
  "5% OFF",
  "10% OFF",
  "15% OFF",
  "8% OFF",
  "12% OFF",
] as const;

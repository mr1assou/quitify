export type Rotation = 0 | 1 | 2 | 3;

/** Each cell offset from the shape's top-left bounding box, as `[row, col]`. */
export type ShapeCells = readonly (readonly [number, number])[];

export type PuzzleShapeDef = {
  id: string;
  shape: ShapeCells;
  color: string;
};

/** Visual + game tuning. */
export const PUZZLE_GRID_SIZE = 6;
export const PUZZLE_TRAY_SIZE = 3;
export const PUZZLE_DURATION_SEC = 180; // 3 min
export const PUZZLE_GRID_GAP = 4;
export const PUZZLE_SIDE_PADDING = 16;

/** Lift the floating drag preview above the finger so the user can see it. */
export const PUZZLE_DRAG_LIFT_PX = 28;

/** Scoring. */
export const PUZZLE_CELL_SCORE = 1;
export const PUZZLE_LINE_BONUS = 18;
export const PUZZLE_MULTI_LINE_BONUS = 12;
export const PUZZLE_FULL_CLEAR_BONUS = 60;

const COLORS = {
  blue: "#7CC8F2",
  green: "#79D5B5",
  purple: "#A084E8",
  yellow: "#F4C66A",
  pink: "#F08FB0",
  lavender: "#C4A6F0",
  cyan: "#84CDE4",
  coral: "#F69A8F",
  mint: "#A4D7A7",
  orange: "#FFB874",
};

/** Tetris-like shape pool. Coords are `[row, col]` in the shape's local bbox. */
export const PUZZLE_SHAPES: readonly PuzzleShapeDef[] = [
  { id: "i1", shape: [[0, 0]], color: COLORS.blue },
  {
    id: "i2",
    shape: [
      [0, 0],
      [0, 1],
    ],
    color: COLORS.green,
  },
  {
    id: "i3",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    color: COLORS.cyan,
  },
  {
    id: "i4",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    color: COLORS.yellow,
  },
  {
    id: "O",
    shape: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    color: COLORS.purple,
  },
  {
    id: "L",
    shape: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
    color: COLORS.pink,
  },
  {
    id: "J",
    shape: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    color: COLORS.lavender,
  },
  {
    id: "T",
    shape: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
    ],
    color: COLORS.coral,
  },
  {
    id: "S",
    shape: [
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 2],
    ],
    color: COLORS.mint,
  },
  {
    id: "Z",
    shape: [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    color: COLORS.orange,
  },
  {
    id: "corner",
    shape: [
      [0, 0],
      [1, 0],
      [1, 1],
    ],
    color: COLORS.green,
  },
];

/** Rotates a shape `n` × 90° clockwise and normalises to non-negative bbox. */
export function rotateShape(
  shape: ShapeCells,
  rotation: Rotation,
): ShapeCells {
  let rotated: [number, number][] = shape.map(([r, c]) => [r, c]);
  for (let i = 0; i < rotation; i += 1) {
    // CW: (r, c) -> (c, -r)
    rotated = rotated.map(([r, c]) => [c, -r]);
  }
  let minR = Infinity;
  let minC = Infinity;
  for (const [r, c] of rotated) {
    if (r < minR) minR = r;
    if (c < minC) minC = c;
  }
  return rotated.map(([r, c]) => [r - minR, c - minC]);
}

/** Returns the rows/cols bounding box of a shape. */
export function shapeBoundingBox(shape: ShapeCells): {
  rows: number;
  cols: number;
} {
  let rows = 0;
  let cols = 0;
  for (const [r, c] of shape) {
    if (r + 1 > rows) rows = r + 1;
    if (c + 1 > cols) cols = c + 1;
  }
  return { rows, cols };
}

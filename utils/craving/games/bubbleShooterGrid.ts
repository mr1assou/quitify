import {
  BUBBLE_SHOOTER_BATCH_DENSITY,
  BUBBLE_SHOOTER_BATCH_ROWS,
  BUBBLE_SHOOTER_COLS_EVEN,
  BUBBLE_SHOOTER_COLOR_COUNT,
  BUBBLE_SHOOTER_GRID_PADDING,
} from "@/constants/craving/games/bubbleShooter";

export type BubbleColor = 0 | 1 | 2 | 3 | 4;

export type GridBubble = {
  row: number;
  col: number;
  color: BubbleColor;
};

export type BubbleGrid = Record<string, GridBubble>;

const EVEN_NEIGHBOR_OFFSETS: readonly (readonly [number, number])[] = [
  [-1, -1],
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
];

const ODD_NEIGHBOR_OFFSETS: readonly (readonly [number, number])[] = [
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, 0],
  [1, 1],
];

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function maxColsForRow(row: number): number {
  return row % 2 === 0 ? BUBBLE_SHOOTER_COLS_EVEN : BUBBLE_SHOOTER_COLS_EVEN - 1;
}

export function isValidCell(row: number, col: number): boolean {
  return row >= 0 && col >= 0 && col < maxColsForRow(row);
}

export function computeBubbleRadius(fieldWidth: number): number {
  const innerWidth = fieldWidth - BUBBLE_SHOOTER_GRID_PADDING * 2;
  return innerWidth / (BUBBLE_SHOOTER_COLS_EVEN * 2);
}

export function gridOrigin(fieldWidth: number, radius: number): { x: number; y: number } {
  const gridWidth = radius * 2 * BUBBLE_SHOOTER_COLS_EVEN;
  return {
    x: (fieldWidth - gridWidth) / 2,
    y: radius,
  };
}

export function bubbleCenter(
  row: number,
  col: number,
  radius: number,
  originX: number,
  originY: number,
): { x: number; y: number } {
  const staggered = row % 2 === 1;
  return {
    x: originX + radius + col * radius * 2 + (staggered ? radius : 0),
    y: originY + radius + row * radius * Math.sqrt(3),
  };
}

export function shooterPosition(
  fieldWidth: number,
  fieldHeight: number,
  radius: number,
): { x: number; y: number } {
  return {
    x: fieldWidth / 2,
    y: fieldHeight - radius * 2.6,
  };
}

export function neighborCells(
  row: number,
  col: number,
): Array<{ row: number; col: number }> {
  const offsets = row % 2 === 0 ? EVEN_NEIGHBOR_OFFSETS : ODD_NEIGHBOR_OFFSETS;
  const neighbors: Array<{ row: number; col: number }> = [];

  for (const [dr, dc] of offsets) {
    const nr = row + dr;
    const nc = col + dc;
    if (isValidCell(nr, nc)) {
      neighbors.push({ row: nr, col: nc });
    }
  }

  return neighbors;
}

export function randomBubbleColor(): BubbleColor {
  return Math.floor(Math.random() * BUBBLE_SHOOTER_COLOR_COUNT) as BubbleColor;
}

export function colorsOnGrid(grid: BubbleGrid): BubbleColor[] {
  const seen = new Set<BubbleColor>();
  for (const bubble of Object.values(grid)) {
    seen.add(bubble.color);
  }
  return Array.from(seen);
}

/** Picks a shooter color biased toward colors still on the board. */
export function pickShooterColor(grid: BubbleGrid): BubbleColor {
  const onBoard = colorsOnGrid(grid);
  const pool =
    onBoard.length > 0
      ? onBoard
      : (Array.from({ length: BUBBLE_SHOOTER_COLOR_COUNT }, (_, i) => i) as BubbleColor[]);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function countGridBubbles(grid: BubbleGrid): number {
  return Object.keys(grid).length;
}

/** Spawns up to `maxBubbles` across the top visible rows. */
export function createBatchGrid(maxBubbles: number): {
  grid: BubbleGrid;
  spawned: number;
} {
  const grid: BubbleGrid = {};
  let spawned = 0;

  const place = (row: number, col: number) => {
    if (spawned >= maxBubbles) return;
    grid[cellKey(row, col)] = { row, col, color: randomBubbleColor() };
    spawned += 1;
  };

  for (let row = 0; row < BUBBLE_SHOOTER_BATCH_ROWS && spawned < maxBubbles; row += 1) {
    const cols = maxColsForRow(row);
    for (let col = 0; col < cols && spawned < maxBubbles; col += 1) {
      if (Math.random() < BUBBLE_SHOOTER_BATCH_DENSITY) {
        place(row, col);
      }
    }
  }

  for (let row = 0; row < BUBBLE_SHOOTER_BATCH_ROWS && spawned < maxBubbles; row += 1) {
    const cols = maxColsForRow(row);
    for (let col = 0; col < cols && spawned < maxBubbles; col += 1) {
      if (!grid[cellKey(row, col)]) {
        place(row, col);
      }
    }
  }

  return { grid, spawned };
}

export function createInitialGrid(): BubbleGrid {
  return createBatchGrid(Number.MAX_SAFE_INTEGER).grid;
}

export function shiftGridDown(grid: BubbleGrid): BubbleGrid {
  const next: BubbleGrid = {};

  for (const bubble of Object.values(grid)) {
    const row = bubble.row + 1;
    const col = bubble.col;
    next[cellKey(row, col)] = { row, col, color: bubble.color };
  }

  return next;
}

export function addCeilingRowFromPool(
  grid: BubbleGrid,
  poolRemaining: number,
): { grid: BubbleGrid; added: number; poolLeft: number } {
  const shifted = shiftGridDown(grid);
  if (poolRemaining <= 0) {
    return { grid: shifted, added: 0, poolLeft: 0 };
  }

  const cols = maxColsForRow(0);
  let added = 0;
  let poolLeft = poolRemaining;

  for (let col = 0; col < cols && poolLeft > 0; col += 1) {
    if (Math.random() < 0.92) {
      shifted[cellKey(0, col)] = {
        row: 0,
        col,
        color: pickShooterColor(shifted),
      };
      added += 1;
      poolLeft -= 1;
    }
  }

  return { grid: shifted, added, poolLeft };
}

/** @deprecated Use `addCeilingRowFromPool` so new rows consume the session pool. */
export function addCeilingRow(grid: BubbleGrid): BubbleGrid {
  return addCeilingRowFromPool(grid, Number.MAX_SAFE_INTEGER).grid;
}

export function hasBubbleAtOrBelowRow(grid: BubbleGrid, row: number): boolean {
  return Object.values(grid).some((bubble) => bubble.row >= row);
}

export function aimAngleFromTouch(
  shooterX: number,
  shooterY: number,
  touchX: number,
  touchY: number,
): number {
  const dx = touchX - shooterX;
  const dy = touchY - shooterY;
  const angle = Math.atan2(dy, dx);
  const min = -Math.PI + 0.15;
  const max = -0.15;
  return Math.max(min, Math.min(max, angle));
}

export function dangerLineY(
  dangerRow: number,
  radius: number,
  originY: number,
): number {
  return originY + dangerRow * radius * Math.sqrt(3);
}

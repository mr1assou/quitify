import {
  BUBBLE_SHOOTER_COLS_EVEN,
  BUBBLE_SHOOTER_MATCH_MIN,
  BUBBLE_SHOOTER_ORPHAN_BONUS,
  BUBBLE_SHOOTER_POINTS_PER_BUBBLE,
  BUBBLE_SHOOTER_PROJECTILE_SPEED,
} from "@/constants/craving/games/bubbleShooter";
import {
  bubbleCenter,
  cellKey,
  maxColsForRow,
  neighborCells,
  type BubbleColor,
  type BubbleGrid,
  type GridBubble,
} from "@/utils/craving/games/bubbleShooterGrid";

export type Projectile = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: BubbleColor;
};

export type ProjectileStepResult =
  | { kind: "moving"; projectile: Projectile }
  | { kind: "stuck"; row: number; col: number; color: BubbleColor };

export type PlacementResult = {
  grid: BubbleGrid;
  popped: number;
  scoreGain: number;
};

const COLLISION_EPSILON = 0.5;

export function createProjectile(
  x: number,
  y: number,
  angle: number,
  color: BubbleColor,
  speed = BUBBLE_SHOOTER_PROJECTILE_SPEED,
): Projectile {
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color,
  };
}

function distance(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function findCluster(
  grid: BubbleGrid,
  startRow: number,
  startCol: number,
  color: BubbleColor,
): Set<string> {
  const startKey = cellKey(startRow, startCol);
  const start = grid[startKey];
  if (!start || start.color !== color) return new Set();

  const cluster = new Set<string>();
  const queue: Array<{ row: number; col: number }> = [{ row: startRow, col: startCol }];

  while (queue.length > 0) {
    const { row, col } = queue.shift()!;
    const key = cellKey(row, col);
    if (cluster.has(key)) continue;

    const bubble = grid[key];
    if (!bubble || bubble.color !== color) continue;

    cluster.add(key);
    for (const neighbor of neighborCells(row, col)) {
      queue.push(neighbor);
    }
  }

  return cluster;
}

function findConnectedToCeiling(grid: BubbleGrid): Set<string> {
  const connected = new Set<string>();
  const queue: GridBubble[] = [];

  for (const bubble of Object.values(grid)) {
    if (bubble.row === 0) {
      queue.push(bubble);
    }
  }

  while (queue.length > 0) {
    const bubble = queue.shift()!;
    const key = cellKey(bubble.row, bubble.col);
    if (connected.has(key)) continue;
    connected.add(key);

    for (const neighbor of neighborCells(bubble.row, bubble.col)) {
      const neighborKey = cellKey(neighbor.row, neighbor.col);
      if (grid[neighborKey] && !connected.has(neighborKey)) {
        queue.push(grid[neighborKey]!);
      }
    }
  }

  return connected;
}

function removeKeys(grid: BubbleGrid, keys: Iterable<string>): BubbleGrid {
  const next: BubbleGrid = { ...grid };
  for (const key of keys) {
    delete next[key];
  }
  return next;
}

function emptyNeighborSlots(
  grid: BubbleGrid,
  around: Array<{ row: number; col: number }>,
): Array<{ row: number; col: number }> {
  const seen = new Set<string>();
  const slots: Array<{ row: number; col: number }> = [];

  for (const cell of around) {
    for (const neighbor of neighborCells(cell.row, cell.col)) {
      const key = cellKey(neighbor.row, neighbor.col);
      if (grid[key] || seen.has(key)) continue;
      seen.add(key);
      slots.push(neighbor);
    }
  }

  return slots;
}

export function findAttachCell(
  grid: BubbleGrid,
  hitRow: number,
  hitCol: number,
  projX: number,
  projY: number,
  radius: number,
  originX: number,
  originY: number,
): { row: number; col: number } | null {
  const seeds = [{ row: hitRow, col: hitCol }, ...neighborCells(hitRow, hitCol)];
  const slots = emptyNeighborSlots(grid, seeds);

  if (slots.length === 0) return null;

  let best = slots[0]!;
  let bestDist = Infinity;

  for (const slot of slots) {
    const center = bubbleCenter(slot.row, slot.col, radius, originX, originY);
    const d = distance(projX, projY, center.x, center.y);
    if (d < bestDist) {
      bestDist = d;
      best = slot;
    }
  }

  return best;
}

function nearestCeilingCell(
  projX: number,
  radius: number,
  originX: number,
  originY: number,
): { row: number; col: number } {
  const cols = maxColsForRow(0);
  let bestCol = 0;
  let bestDist = Infinity;

  for (let col = 0; col < cols; col += 1) {
    const center = bubbleCenter(0, col, radius, originX, originY);
    const d = Math.abs(center.x - projX);
    if (d < bestDist) {
      bestDist = d;
      bestCol = col;
    }
  }

  return { row: 0, col: bestCol };
}

export function stepProjectile(
  projectile: Projectile,
  deltaMs: number,
  fieldWidth: number,
  ceilingY: number,
  radius: number,
  originX: number,
  originY: number,
  grid: BubbleGrid,
): ProjectileStepResult {
  const travel = deltaMs;
  let { x, y, vx, vy, color } = projectile;

  const gridWidth = radius * 2 * BUBBLE_SHOOTER_COLS_EVEN;
  const leftBound = originX + radius;
  const rightBound = originX + gridWidth - radius;

  const steps = Math.max(1, Math.ceil(travel / 8));
  const stepMs = travel / steps;

  for (let i = 0; i < steps; i += 1) {
    x += vx * stepMs;
    y += vy * stepMs;

    if (x - radius <= leftBound) {
      x = leftBound;
      vx = Math.abs(vx);
    } else if (x + radius >= rightBound) {
      x = rightBound;
      vx = -Math.abs(vx);
    }

    if (y - radius <= ceilingY) {
      const cell = nearestCeilingCell(x, radius, originX, originY);
      return { kind: "stuck", row: cell.row, col: cell.col, color };
    }

    for (const bubble of Object.values(grid)) {
      const center = bubbleCenter(bubble.row, bubble.col, radius, originX, originY);
      const hitDist = radius * 2 - COLLISION_EPSILON;
      if (distance(x, y, center.x, center.y) <= hitDist) {
        const attach = findAttachCell(
          grid,
          bubble.row,
          bubble.col,
          x,
          y,
          radius,
          originX,
          originY,
        );
        if (attach) {
          return { kind: "stuck", row: attach.row, col: attach.col, color };
        }
      }
    }
  }

  return {
    kind: "moving",
    projectile: { x, y, vx, vy, color },
  };
}

export function resolvePlacement(
  grid: BubbleGrid,
  row: number,
  col: number,
  color: BubbleColor,
): PlacementResult {
  const key = cellKey(row, col);
  if (grid[key]) {
    return { grid, popped: 0, scoreGain: 0 };
  }

  let next: BubbleGrid = {
    ...grid,
    [key]: { row, col, color },
  };

  const cluster = findCluster(next, row, col, color);
  let popped = 0;
  let scoreGain = 0;

  if (cluster.size >= BUBBLE_SHOOTER_MATCH_MIN) {
    next = removeKeys(next, cluster);
    popped += cluster.size;
    scoreGain += cluster.size * BUBBLE_SHOOTER_POINTS_PER_BUBBLE;
  }

  const anchored = findConnectedToCeiling(next);
  const orphanKeys: string[] = [];
  for (const bubbleKey of Object.keys(next)) {
    if (!anchored.has(bubbleKey)) {
      orphanKeys.push(bubbleKey);
    }
  }

  if (orphanKeys.length > 0) {
    next = removeKeys(next, orphanKeys);
    popped += orphanKeys.length;
    scoreGain +=
      orphanKeys.length * (BUBBLE_SHOOTER_POINTS_PER_BUBBLE + BUBBLE_SHOOTER_ORPHAN_BONUS);
  }

  return { grid: next, popped, scoreGain };
}

type SpawnPoint = { x: number; y: number };

const PLAY_MARGIN = 0.06;
const PLAY_MAX = 0.94;
const GRID_COLS = 3;
const GRID_ROWS = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: SpawnPoint, b: SpawnPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function cellIndex(x: number, y: number): number {
  const span = PLAY_MAX - PLAY_MARGIN;
  const col = Math.min(
    GRID_COLS - 1,
    Math.floor(((x - PLAY_MARGIN) / span) * GRID_COLS),
  );
  const row = Math.min(
    GRID_ROWS - 1,
    Math.floor(((y - PLAY_MARGIN) / span) * GRID_ROWS),
  );
  return row * GRID_COLS + col;
}

function randomInCell(cell: number): SpawnPoint {
  const span = PLAY_MAX - PLAY_MARGIN;
  const cellW = span / GRID_COLS;
  const cellH = span / GRID_ROWS;
  const col = cell % GRID_COLS;
  const row = Math.floor(cell / GRID_COLS);

  return {
    x: PLAY_MARGIN + col * cellW + Math.random() * cellW,
    y: PLAY_MARGIN + row * cellH + Math.random() * cellH,
  };
}

function leastCrowdedCells(existing: readonly SpawnPoint[]): number[] {
  const counts = Array.from({ length: GRID_COLS * GRID_ROWS }, () => 0);
  for (const point of existing) {
    counts[cellIndex(point.x, point.y)] += 1;
  }

  const minCount = Math.min(...counts);
  return counts
    .map((count, index) => (count === minCount ? index : -1))
    .filter((index) => index >= 0);
}

function randomDistributedPoint(existing: readonly SpawnPoint[]): SpawnPoint {
  const cells = leastCrowdedCells(existing);
  const cell = cells[Math.floor(Math.random() * cells.length)];
  return randomInCell(cell);
}

function nearestGap(candidate: SpawnPoint, existing: readonly SpawnPoint[]): number {
  if (existing.length === 0) return Number.POSITIVE_INFINITY;
  return existing.reduce((min, point) => {
    const gap = distance(candidate, point);
    return gap < min ? gap : min;
  }, Number.POSITIVE_INFINITY);
}

function pickSpreadPosition(existing: readonly SpawnPoint[]): SpawnPoint {
  const minDistance = 0.16 + Math.random() * 0.08;

  let best = randomDistributedPoint(existing);
  let bestGap = nearestGap(best, existing);

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const candidate = randomDistributedPoint(existing);
    const gap = nearestGap(candidate, existing);

    if (gap >= minDistance) {
      return candidate;
    }

    if (gap > bestGap) {
      bestGap = gap;
      best = candidate;
    }
  }

  return best;
}

function pickClusterPosition(existing: readonly SpawnPoint[]): SpawnPoint {
  const anchor = existing[Math.floor(Math.random() * existing.length)];
  const angle = Math.random() * Math.PI * 2;
  const offset = 0.1 + Math.random() * 0.12;

  const candidate = {
    x: clamp(anchor.x + Math.cos(angle) * offset, PLAY_MARGIN, PLAY_MAX),
    y: clamp(anchor.y + Math.sin(angle) * offset, PLAY_MARGIN, PLAY_MAX),
  };

  if (nearestGap(candidate, existing) < 0.09) {
    return pickSpreadPosition(existing);
  }

  return candidate;
}

type SpawnOptions = {
  /** Force spread placement (used for the opening burst). */
  spreadOnly?: boolean;
};

/** Picks a spawn point spread across the field, with occasional pairs nearby. */
export function pickTapDestroySpawnPosition(
  existing: readonly SpawnPoint[],
  options: SpawnOptions = {},
): SpawnPoint {
  if (existing.length === 0) {
    return randomDistributedPoint([]);
  }

  const cluster = !options.spreadOnly && existing.length > 0 && Math.random() < 0.16;
  return cluster ? pickClusterPosition(existing) : pickSpreadPosition(existing);
}

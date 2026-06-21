import {
  CIGARETTE_NINJA_DURATION_SEC,
  CIGARETTE_NINJA_GOLDEN_CHANCE,
  CIGARETTE_NINJA_GRAVITY,
  CIGARETTE_NINJA_INITIAL_VY_MAX,
  CIGARETTE_NINJA_INITIAL_VY_MIN,
  CIGARETTE_NINJA_MAX_OBJECTS_MAX,
  CIGARETTE_NINJA_MAX_OBJECTS_START,
  CIGARETTE_NINJA_OBJECT_CONFIG,
  CIGARETTE_NINJA_SPAWN_INTERVAL_MIN_MS,
  CIGARETTE_NINJA_SPAWN_INTERVAL_START_MS,
  CIGARETTE_NINJA_TERMINAL_VY,
  type CigaretteNinjaObjectKind,
} from "@/constants/craving/games/cigaretteNinja";

export type FieldSize = { width: number; height: number };

export type NinjaFlyingObject = {
  id: string;
  kind: CigaretteNinjaObjectKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  health: number;
  maxHealth: number;
  /** Picks alternate art for vape / smoke kinds. */
  spriteVariant: number;
};

export function segmentIntersectsCircle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1) {
    return Math.hypot(cx - x1, cy - y1) <= radius;
  }
  let t = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const px = x1 + t * dx;
  const py = y1 + t * dy;
  return Math.hypot(cx - px, cy - py) <= radius;
}

function pickStandardKind(): CigaretteNinjaObjectKind {
  const roll = Math.random();
  if (roll < 0.5) return "cigarette";
  if (roll < 0.72) return "vape";
  return "smoke";
}

export function createFlyingObject(
  id: string,
  field: FieldSize,
  options: { forceBoss?: boolean; forceGolden?: boolean } = {},
): NinjaFlyingObject {
  const kind = options.forceBoss
    ? "boss"
    : options.forceGolden || Math.random() < CIGARETTE_NINJA_GOLDEN_CHANCE
      ? "golden"
      : pickStandardKind();
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[kind];
  const margin = config.size * 0.55;

  const x = margin + Math.random() * Math.max(field.width - margin * 2, 1);
  const y = -config.size * (0.9 + Math.random() * 0.7);
  const vx = (Math.random() - 0.5) * 1.4;
  const vy =
    CIGARETTE_NINJA_INITIAL_VY_MIN +
    Math.random() * (CIGARETTE_NINJA_INITIAL_VY_MAX - CIGARETTE_NINJA_INITIAL_VY_MIN);
  const spriteVariant =
    kind === "cigarette"
      ? Math.floor(Math.random() * 3)
      : kind === "vape" || kind === "smoke"
        ? Math.random() < 0.5
          ? 0
          : 1
        : 0;

  return {
    id,
    kind,
    x,
    y,
    vx,
    vy,
    rotation: Math.random() * 50 - 25,
    rotationSpeed: (Math.random() - 0.5) * 2.5,
    health: config.health,
    maxHealth: config.health,
    spriteVariant,
  };
}

export function advanceFlyingObject(
  object: NinjaFlyingObject,
  field: FieldSize,
  dt: number,
): NinjaFlyingObject {
  // Clamp integration step to avoid sudden speed jumps on dropped frames.
  const step = Math.min(dt, 32);
  const scale = step / 16;
  const nextVy = Math.min(
    CIGARETTE_NINJA_TERMINAL_VY,
    object.vy + CIGARETTE_NINJA_GRAVITY * scale,
  );
  return {
    ...object,
    x: object.x + object.vx * scale,
    // Move by current velocity first; then apply capped acceleration.
    // This avoids a perceived "speed jump" on each frame.
    y: object.y + object.vy * scale,
    vy: nextVy,
    rotation: object.rotation + object.rotationSpeed * scale,
  };
}

export function isOffScreen(object: NinjaFlyingObject, field: FieldSize): boolean {
  const config = CIGARETTE_NINJA_OBJECT_CONFIG[object.kind];
  const pad = config.size * 0.6;
  return (
    object.y > field.height + pad ||
    object.x < -pad ||
    object.x > field.width + pad
  );
}

export function spawnIntervalForElapsed(elapsedMs: number): number {
  const t = Math.min(1, elapsedMs / (CIGARETTE_NINJA_DURATION_SEC * 1000));
  return Math.round(
    CIGARETTE_NINJA_SPAWN_INTERVAL_START_MS -
      t *
        (CIGARETTE_NINJA_SPAWN_INTERVAL_START_MS -
          CIGARETTE_NINJA_SPAWN_INTERVAL_MIN_MS),
  );
}

export function maxObjectsForElapsed(elapsedMs: number): number {
  const t = Math.min(1, elapsedMs / (CIGARETTE_NINJA_DURATION_SEC * 1000));
  return Math.round(
    CIGARETTE_NINJA_MAX_OBJECTS_START +
      t * (CIGARETTE_NINJA_MAX_OBJECTS_MAX - CIGARETTE_NINJA_MAX_OBJECTS_START),
  );
}

export function objectRadius(kind: CigaretteNinjaObjectKind): number {
  return CIGARETTE_NINJA_OBJECT_CONFIG[kind].size * 0.52;
}

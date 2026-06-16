import {
  COLOR_SWITCH_BALL_RADIUS,
  COLOR_SWITCH_BALL_SCREEN_Y_RATIO,
  COLOR_SWITCH_COLOR_ORDER,
  COLOR_SWITCH_FALL_DEATH_Y,
  COLOR_SWITCH_INITIAL_OBSTACLES,
  COLOR_SWITCH_OBSTACLE_SPACING,
  COLOR_SWITCH_ORB_RADIUS,
  COLOR_SWITCH_PASSAGE_HALF_WINDOW,
  COLOR_SWITCH_PLUS_ARM_HALF,
  COLOR_SWITCH_PLUS_ARM_LEN,
  COLOR_SWITCH_PLUS_INNER_GAP,
  COLOR_SWITCH_PLUS_ROT_SPEED,
  COLOR_SWITCH_RING_INNER_R,
  COLOR_SWITCH_RING_OUTER_R,
  COLOR_SWITCH_RING_ROT_SPEED,
  COLOR_SWITCH_STAR_RADIUS,
  type ColorSwitchColor,
} from "@/constants/craving/games/colorSwitch";

export type ColorSwitchObstacleKind = "ring" | "plus";

export type ColorSwitchObstacle = {
  id: string;
  kind: ColorSwitchObstacleKind;
  worldY: number;
  rotation: number;
  rotationSpeed: number;
  segments: [
    ColorSwitchColor,
    ColorSwitchColor,
    ColorSwitchColor,
    ColorSwitchColor,
  ];
  starAngle: number;
  starCollected: boolean;
  passed: boolean;
};

export type ColorSwitchOrb = {
  id: string;
  worldY: number;
  collected: boolean;
};

export type FieldSize = { width: number; height: number };

export type CollisionResult = "none" | "safe" | "fatal";

export type ColorSwitchDeathReason = "collision" | "fall";

export function normalizeAngle(deg: number): number {
  let angle = deg % 360;
  if (angle < 0) angle += 360;
  return angle;
}

export function nextColor(color: ColorSwitchColor): ColorSwitchColor {
  const index = COLOR_SWITCH_COLOR_ORDER.indexOf(color);
  return COLOR_SWITCH_COLOR_ORDER[(index + 1) % COLOR_SWITCH_COLOR_ORDER.length];
}

export function shuffledSegmentColors(): [
  ColorSwitchColor,
  ColorSwitchColor,
  ColorSwitchColor,
  ColorSwitchColor,
] {
  const colors = [...COLOR_SWITCH_COLOR_ORDER];
  for (let i = colors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }
  return colors as [
    ColorSwitchColor,
    ColorSwitchColor,
    ColorSwitchColor,
    ColorSwitchColor,
  ];
}

export function worldToScreenY(
  worldY: number,
  cameraWorldY: number,
  anchorScreenY: number,
): number {
  return anchorScreenY - (worldY - cameraWorldY);
}

export function anchorScreenY(field: FieldSize): number {
  return field.height * COLOR_SWITCH_BALL_SCREEN_Y_RATIO;
}

export function computeBallScreenY(
  ballWorldY: number,
  cameraWorldY: number,
  field: FieldSize,
): number {
  return worldToScreenY(ballWorldY, cameraWorldY, anchorScreenY(field));
}

export function ballScreenPosition(
  field: FieldSize,
  ballWorldY = 0,
  cameraWorldY = 0,
): { x: number; y: number } {
  return {
    x: field.width / 2,
    y: computeBallScreenY(ballWorldY, cameraWorldY, field),
  };
}

function angleFromTopDeg(dx: number, dy: number): number {
  return normalizeAngle((Math.atan2(dx, -dy) * 180) / Math.PI);
}

function segmentIndex(angleDeg: number, rotationDeg: number): number {
  const local = normalizeAngle(angleDeg - rotationDeg);
  return Math.floor(local / 90) % 4;
}

function rotatePointLocal(
  x: number,
  y: number,
  rotationDeg: number,
): { x: number; y: number } {
  const rad = (-rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

function circleRectHit(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): boolean {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  return Math.hypot(cx - closestX, cy - closestY) < radius;
}

export function checkRingCollision(
  ballX: number,
  ballY: number,
  obstacleX: number,
  obstacleY: number,
  rotation: number,
  segments: ColorSwitchObstacle["segments"],
  ballColor: ColorSwitchColor,
): CollisionResult {
  const dx = ballX - obstacleX;
  const dy = ballY - obstacleY;
  const dist = Math.hypot(dx, dy);

  if (dist + COLOR_SWITCH_BALL_RADIUS <= COLOR_SWITCH_RING_INNER_R) return "none";
  if (dist - COLOR_SWITCH_BALL_RADIUS >= COLOR_SWITCH_RING_OUTER_R) return "none";

  const seg = segmentIndex(angleFromTopDeg(dx, dy), rotation);
  return segments[seg] === ballColor ? "safe" : "fatal";
}

export function checkPlusCollision(
  ballX: number,
  ballY: number,
  obstacleX: number,
  obstacleY: number,
  rotation: number,
  segments: ColorSwitchObstacle["segments"],
  ballColor: ColorSwitchColor,
): CollisionResult {
  const local = rotatePointLocal(ballX - obstacleX, ballY - obstacleY, rotation);
  const { x: lx, y: ly } = local;
  const r = COLOR_SWITCH_BALL_RADIUS;
  const half = COLOR_SWITCH_PLUS_ARM_HALF;
  const len = COLOR_SWITCH_PLUS_ARM_LEN;
  const gap = COLOR_SWITCH_PLUS_INNER_GAP;

  const arms: {
    rect: [number, number, number, number];
    color: ColorSwitchColor;
  }[] = [
    { rect: [-half, -len, half * 2, len - gap], color: segments[0] },
    { rect: [gap, -half, len - gap, half * 2], color: segments[1] },
    { rect: [-half, gap, half * 2, len - gap], color: segments[2] },
    { rect: [-len, -half, len - gap, half * 2], color: segments[3] },
  ];

  let touched = false;
  for (const arm of arms) {
    const [rx, ry, rw, rh] = arm.rect;
    if (!circleRectHit(lx, ly, r, rx, ry, rw, rh)) continue;
    touched = true;
    if (arm.color !== ballColor) return "fatal";
  }

  return touched ? "safe" : "none";
}

export function checkObstacleCollision(
  obstacle: ColorSwitchObstacle,
  ballX: number,
  ballY: number,
  obstacleScreenY: number,
  ballColor: ColorSwitchColor,
  ballWorldY: number,
): CollisionResult {
  if (obstacle.passed) return "none";

  const deltaWorldY = ballWorldY - obstacle.worldY;
  if (Math.abs(deltaWorldY) > COLOR_SWITCH_PASSAGE_HALF_WINDOW) return "none";

  const screenGap = Math.abs(obstacleScreenY - ballY);
  if (screenGap > COLOR_SWITCH_RING_OUTER_R + COLOR_SWITCH_BALL_RADIUS + 6) {
    return "none";
  }

  if (obstacle.kind === "ring") {
    return checkRingCollision(
      ballX,
      ballY,
      ballX,
      obstacleScreenY,
      obstacle.rotation,
      obstacle.segments,
      ballColor,
    );
  }
  return checkPlusCollision(
    ballX,
    ballY,
    ballX,
    obstacleScreenY,
    obstacle.rotation,
    obstacle.segments,
    ballColor,
  );
}

export function starScreenPosition(
  obstacle: ColorSwitchObstacle,
  obstacleScreenX: number,
  obstacleScreenY: number,
): { x: number; y: number } {
  const midR = (COLOR_SWITCH_RING_INNER_R + COLOR_SWITCH_RING_OUTER_R) / 2;
  const rad = ((obstacle.rotation + obstacle.starAngle) * Math.PI) / 180;
  return {
    x: obstacleScreenX + midR * Math.sin(rad),
    y: obstacleScreenY - midR * Math.cos(rad),
  };
}

export function tryCollectStar(
  obstacle: ColorSwitchObstacle,
  ballX: number,
  ballY: number,
  obstacleScreenX: number,
  obstacleScreenY: number,
): boolean {
  if (obstacle.starCollected) return false;
  const star = starScreenPosition(obstacle, obstacleScreenX, obstacleScreenY);
  return (
    Math.hypot(ballX - star.x, ballY - star.y) <
    COLOR_SWITCH_BALL_RADIUS + COLOR_SWITCH_STAR_RADIUS
  );
}

export function tryCollectOrb(
  orb: ColorSwitchOrb,
  ballX: number,
  ballY: number,
  orbScreenY: number,
  ballScreenX: number,
): boolean {
  if (orb.collected) return false;
  return (
    Math.hypot(ballX - ballScreenX, ballY - orbScreenY) <
    COLOR_SWITCH_BALL_RADIUS + COLOR_SWITCH_ORB_RADIUS
  );
}

export function advanceObstacle(
  obstacle: ColorSwitchObstacle,
  dtScale: number,
): ColorSwitchObstacle {
  return {
    ...obstacle,
    rotation: normalizeAngle(obstacle.rotation + obstacle.rotationSpeed * dtScale),
  };
}

export function createObstacle(
  id: string,
  worldY: number,
  index: number,
  startBallColor?: ColorSwitchColor,
): ColorSwitchObstacle {
  const kind: ColorSwitchObstacleKind = index % 3 === 2 ? "plus" : "ring";
  const direction = Math.random() < 0.5 ? 1 : -1;
  let segments = shuffledSegmentColors();

  // First gate: guarantee the bottom segment (index 2) matches the starting ball color.
  if (index === 0 && startBallColor) {
    const bottomIndex = segments.indexOf(startBallColor);
    if (bottomIndex !== 2) {
      const next = [...segments] as ColorSwitchObstacle["segments"];
      next[2] = startBallColor;
      next[bottomIndex] = segments[2];
      segments = next;
    }
  }

  return {
    id,
    kind,
    worldY,
    rotation: index === 0 ? 0 : Math.random() * 360,
    rotationSpeed:
      (kind === "ring"
        ? COLOR_SWITCH_RING_ROT_SPEED
        : COLOR_SWITCH_PLUS_ROT_SPEED) * direction,
    segments,
    starAngle: 45 + Math.random() * 90,
    starCollected: false,
    passed: false,
  };
}

export function createInitialWorld(startBallColor: ColorSwitchColor): {
  obstacles: ColorSwitchObstacle[];
  orbs: ColorSwitchOrb[];
  nextWorldY: number;
} {
  const obstacles: ColorSwitchObstacle[] = [];
  const orbs: ColorSwitchOrb[] = [];
  let worldY = COLOR_SWITCH_OBSTACLE_SPACING * 0.6;

  for (let i = 0; i < COLOR_SWITCH_INITIAL_OBSTACLES; i += 1) {
    obstacles.push(createObstacle(`obs-${i}`, worldY, i, startBallColor));

    // Spawn a color-switch orb between every obstacle
    if (i < COLOR_SWITCH_INITIAL_OBSTACLES - 1) {
      orbs.push({
        id: `orb-${i}`,
        worldY: worldY + COLOR_SWITCH_OBSTACLE_SPACING * 0.5,
        collected: false,
      });
    }

    worldY += COLOR_SWITCH_OBSTACLE_SPACING;
  }

  return { obstacles, orbs, nextWorldY: worldY };
}

export function shouldSpawnObstacle(
  ballWorldY: number,
  nextWorldY: number,
  spawnAhead: number,
): boolean {
  return nextWorldY - ballWorldY < spawnAhead;
}

export function isFallDeath(ballWorldY: number): boolean {
  return ballWorldY < COLOR_SWITCH_FALL_DEATH_Y;
}

export function deathReasonForBallY(ballWorldY: number): ColorSwitchDeathReason {
  return isFallDeath(ballWorldY) ? "fall" : "collision";
}

export function obstaclePassed(
  obstacle: ColorSwitchObstacle,
  ballWorldY: number,
): boolean {
  return !obstacle.passed && ballWorldY > obstacle.worldY + 40;
}

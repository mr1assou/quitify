/** Neon palette — matches classic Color Switch. */
export const COLOR_SWITCH_PALETTE = {
  yellow: "#F5D547",
  purple: "#9B59F5",
  pink: "#FF4D9E",
  cyan: "#4DEBFF",
} as const;

export type ColorSwitchColor = keyof typeof COLOR_SWITCH_PALETTE;

export const COLOR_SWITCH_COLOR_ORDER: readonly ColorSwitchColor[] = [
  "yellow",
  "purple",
  "pink",
  "cyan",
];

export const COLOR_SWITCH_BG = "#0B0B14";

export const COLOR_SWITCH_BALL_RADIUS = 11;

export const COLOR_SWITCH_JUMP_FORCE = 7.0;
export const COLOR_SWITCH_GRAVITY = 0.35;
export const COLOR_SWITCH_MAX_FALL_SPEED = -16;

/** Fixed ball position on screen (ratio of playfield height). */
export const COLOR_SWITCH_BALL_SCREEN_Y_RATIO = 0.72;

export const COLOR_SWITCH_RING_OUTER_R = 120;
export const COLOR_SWITCH_RING_INNER_R = 92;

export const COLOR_SWITCH_PLUS_ARM_LEN = 120;
export const COLOR_SWITCH_PLUS_ARM_HALF = 26;
export const COLOR_SWITCH_PLUS_INNER_GAP = 48;

export const COLOR_SWITCH_OBSTACLE_SPACING = 500;
export const COLOR_SWITCH_SPAWN_AHEAD = 1500;
export const COLOR_SWITCH_INITIAL_OBSTACLES = 5;

export const COLOR_SWITCH_RING_ROT_SPEED = 0.65;
export const COLOR_SWITCH_PLUS_ROT_SPEED = 0.42;

export const COLOR_SWITCH_STAR_SCORE = 5;
export const COLOR_SWITCH_PASS_SCORE = 2;

export const COLOR_SWITCH_ORB_RADIUS = 13;
export const COLOR_SWITCH_STAR_RADIUS = 7;

/** Visual gap in degrees between ring segments. */
export const COLOR_SWITCH_RING_SEGMENT_GAP = 6;

/** World-Y window where ring/plus collision is evaluated. */
export const COLOR_SWITCH_PASSAGE_HALF_WINDOW = 140;

/** Fall below this world Y → game over. */
export const COLOR_SWITCH_FALL_DEATH_Y = -200;

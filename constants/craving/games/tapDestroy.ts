/** Session length — 5 minutes. */
export const TAP_DESTROY_DURATION_SEC = 5 * 60;

/** Base spawn interval; speeds up as score rises. */
export const TAP_DESTROY_SPAWN_INTERVAL_MS = 480;

/** Fastest spawn interval once the player is on a roll. */
export const TAP_DESTROY_SPAWN_INTERVAL_MIN_MS = 200;

/** Max cigarettes visible at once. */
export const TAP_DESTROY_MAX_ON_SCREEN = 14;

/** How long a cigarette stays before fading away (ms). */
export const TAP_DESTROY_CIGARETTE_LIFETIME_MS = 3_200;

/** Tap within this window to keep the combo chain (ms). */
export const TAP_DESTROY_COMBO_WINDOW_MS = 1_200;

/** Initial burst when the round starts. */
export const TAP_DESTROY_INITIAL_BURST = 6;

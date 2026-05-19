/** Seconds the player must hold continuously per wave (5 waves ≈ 30s of focus). */
export const HOLD_TO_CONTROL_WAVE_SEC: readonly number[] = [4, 5, 6, 7, 8];

export const HOLD_TO_CONTROL_TOTAL_WAVES = HOLD_TO_CONTROL_WAVE_SEC.length;

/** Tick interval while the finger is down (ms). */
export const HOLD_TO_CONTROL_TICK_MS = 50;

/** Brief pause after a successful wave before the next (ms). */
export const HOLD_TO_CONTROL_WAVE_PAUSE_MS = 900;

/** Score per completed wave (base). */
export const HOLD_TO_CONTROL_WAVE_SCORE = 10;

/** Bonus per wave index (later waves worth more). */
export const HOLD_TO_CONTROL_WAVE_BONUS = 2;

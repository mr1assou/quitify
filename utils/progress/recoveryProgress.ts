import type { RecoveryProgressValues } from "@/types/progress/recovery";

const MS_PER_HOUR = 1000 * 60 * 60;

/** Illustrative windows (wellness-style), not clinical measurements. */
export const RECOVERY_MODEL_WINDOWS = {
  /** Hours smoke-free → 100% nicotine ring */
  nicotineHours: 72,
  /** Days smoke-free → 100% breathing ring */
  breathingDays: 28,
  /** Days smoke-free → 100% heart ring (cardiovascular risk drops significantly at ~6 months) */
  heartDays: 180,
} as const;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * `smokeFreeMs`: elapsed time since streak start (same basis as home streak).
 */
export function computeRecoveryProgressValues(smokeFreeMs: number): RecoveryProgressValues {
  const hours = smokeFreeMs / MS_PER_HOUR;
  const days = hours / 24;

  return {
    nicotine: clamp01(hours / RECOVERY_MODEL_WINDOWS.nicotineHours),
    breathing: clamp01(days / RECOVERY_MODEL_WINDOWS.breathingDays),
    heart: clamp01(days / RECOVERY_MODEL_WINDOWS.heartDays),
  };
}

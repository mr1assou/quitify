import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/shared/useNow";
import type { RecoveryProgressValues } from "@/types/progress/recovery";
import { computeRecoveryProgressValues } from "@/utils/progress/recoveryProgress";

/**
 * Smoke-free recovery ring progress (same time basis as the home streak).
 */
export function useRecoveryProgress(intervalMs = 60_000): RecoveryProgressValues | null {
  const { state } = useApp();
  const now = useNow(intervalMs);

  return useMemo(() => {
    if (!state.profile) return null;
    const streakStart = state.profile.streakStart;
    const smokeFreeMs = Math.max(0, now - streakStart);
    return computeRecoveryProgressValues(smokeFreeMs);
  }, [now, state.profile]);
}

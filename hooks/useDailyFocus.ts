import { useMemo } from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/useNow";
import { useTodayCravings } from "@/hooks/useStats";
import type { DailyFocus } from "@/types/dailyFocus";
import { computeDailyFocus } from "@/utils/dailyFocus";

/**
 * Reactive Daily Focus state for the missions screen.
 * Re-computes on each tick so auto missions advance live.
 */
export function useDailyFocus(intervalMs = 60_000): DailyFocus | null {
  const { state } = useApp();
  const now = useNow(intervalMs);
  const todayCravings = useTodayCravings();

  return useMemo(() => {
    if (!state.profile) return null;
    return computeDailyFocus(state.profile, todayCravings, now);
  }, [state.profile, todayCravings, now]);
}

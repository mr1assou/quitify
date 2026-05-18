import { useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useNow } from "@/hooks/useNow";
import type {
  CravingTimeBucket,
  SavingsBreakdown,
  SeriesPoint,
  StatsRange,
} from "@/types/statsDashboard";
import {
  buildCravingTimeBuckets,
  buildSavingsBreakdown,
  buildSavingsSeries,
} from "@/utils/statsSeries";

export type StatsDashboard = {
  range: StatsRange;
  setRange: (range: StatsRange) => void;
  series: SeriesPoint[];
  savings: SavingsBreakdown;
  cravingBuckets: CravingTimeBucket[];
};

/**
 * Composed dashboard state for the Stats screen.
 * Recomputes on each minute-tick (and when range changes).
 */
export function useStatsDashboard(): StatsDashboard | null {
  const { state } = useApp();
  const now = useNow(60_000);
  const [range, setRange] = useState<StatsRange>("7d");

  return useMemo(() => {
    if (!state.profile) return null;
    return {
      range,
      setRange,
      series: buildSavingsSeries(state.profile, range, now),
      savings: buildSavingsBreakdown(state.profile, now),
      cravingBuckets: buildCravingTimeBuckets(state.cravings),
    };
  }, [state.profile, state.cravings, now, range]);
}

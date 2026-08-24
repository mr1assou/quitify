import { useMemo, useState } from "react";

import { useApp } from "@/context/AppContext";
import { useLocale } from "@/context/LocaleContext";
import { useNow } from "@/hooks/shared/useNow";
import type {
  CravingTimeBucket,
  SavingsBreakdown,
  SeriesPoint,
  StatsRange,
} from "@/types/stats/statsDashboard";
import {
  buildCravingTimeBuckets,
  buildSavingsBreakdown,
  buildSavingsSeries,
} from "@/utils/stats/statsSeries";

export type StatsDashboard = {
  range: StatsRange;
  setRange: (range: StatsRange) => void;
  series: SeriesPoint[];
  savings: SavingsBreakdown;
  cravingBuckets: CravingTimeBucket[];
};

export function useStatsDashboard(): StatsDashboard | null {
  const { state } = useApp();
  const { locale } = useLocale();
  const now = useNow(60_000);
  const [range, setRange] = useState<StatsRange>("7d");

  return useMemo(() => {
    if (!state.profile) return null;
    return {
      range,
      setRange,
      series: buildSavingsSeries(state.profile, range, now, locale),
      savings: buildSavingsBreakdown(state.profile, now),
      cravingBuckets: buildCravingTimeBuckets(state.cravings),
    };
  }, [state.profile, state.cravings, now, range, locale]);
}

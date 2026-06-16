import { View } from "react-native";

import { StatBlock } from "@/components/feature/stats/StatBlock";
import { formatCurrency, formatDuration, formatNumber } from "@/utils/shared/format";

type Props = {
  moneySaved: number;
  cigarettesAvoided: number;
  hoursReclaimed: number;
  cravingsHandled: number;
  currency: string;
};

/**
 * 2×2 dashboard tiles at the top of the Stats screen.
 * Kept dumb on purpose — all data comes from the screen's hook.
 */
export function StatsSummaryGrid({
  moneySaved,
  cigarettesAvoided,
  hoursReclaimed,
  cravingsHandled,
  currency,
}: Props) {
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <StatBlock
          label="Money saved"
          value={moneySaved}
          display={formatCurrency(moneySaved, currency)}
          icon="cash"
          accent="primary"
          delay={0}
        />
        <StatBlock
          label="Cigarettes avoided"
          value={cigarettesAvoided}
          display={formatNumber(cigarettesAvoided)}
          icon="ban"
          accent="secondary"
          delay={60}
        />
      </View>

      <View className="flex-row gap-3">
        <StatBlock
          label="Cravings handled"
          value={cravingsHandled}
          icon="shield-checkmark"
          accent="accent"
          delay={120}
        />
        <StatBlock
          label="Time reclaimed"
          value={hoursReclaimed}
          display={formatDuration(hoursReclaimed)}
          icon="time"
          accent="secondary"
          delay={180}
        />
      </View>
    </View>
  );
}

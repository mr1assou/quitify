import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { RangeTabs } from "@/components/feature/stats/RangeTabs";
import { rangeWindowLabel } from "@/constants/statsRanges";
import { Card } from "@/components/ui/Card";
import { LineChart } from "@/components/ui/LineChart";
import { useTheme } from "@/context/ThemeContext";
import type { SeriesPoint, StatsRange } from "@/types/statsDashboard";
import { formatCurrency } from "@/utils/format";

type Props = {
  range: StatsRange;
  onRangeChange: (range: StatsRange) => void;
  series: SeriesPoint[];
  currency: string;
};

export function SavingsChartCard({ range, onRangeChange, series, currency }: Props) {
  const { colors } = useTheme();
  const total = series.reduce((sum, p) => sum + p.value, 0);
  const windowLabel = rangeWindowLabel(range);
  const pointCount = series.length;
  const showDots = pointCount <= 14;

  return (
    <Animated.View entering={FadeIn.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Savings trend
            </Text>
            <Text className="mt-1 text-2xl font-bold text-foreground dark:text-d-text">
              {formatCurrency(total, currency)}
            </Text>
          </View>
          <Text className="pb-1 text-xs text-muted-foreground dark:text-d-muted">{windowLabel}</Text>
        </View>

        <View className="mt-4">
          <RangeTabs value={range} onChange={onRangeChange} />
        </View>

        <View className="mt-4">
          <LineChart
            data={series.map((p) => ({ label: p.label, value: p.value }))}
            color={colors.primary}
            formatValue={(n) => formatCurrency(n, currency)}
            showDots={showDots}
          />
        </View>
      </Card>
    </Animated.View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { SavingsBreakdown } from "@/types/stats/statsDashboard";
import { formatCurrency } from "@/utils/shared/format";

type Props = {
  breakdown: SavingsBreakdown;
  currency: string;
};

type RowDef = {
  id: keyof SavingsBreakdown;
  label: string;
};

const ROWS: readonly RowDef[] = [
  { id: "perDay", label: "Per day" },
  { id: "perWeek", label: "Per week" },
  { id: "perMonth", label: "Per month" },
  { id: "perYear", label: "Per year" },
];

export function SavingsBreakdownCard({ breakdown, currency }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
            <Ionicons name="cash" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Savings breakdown
            </Text>
            <Text className="mt-0.5 text-base font-bold text-foreground dark:text-d-text">
              {formatCurrency(breakdown.totalSoFar, currency)} so far
            </Text>
          </View>
        </View>

        <View className="mt-4 gap-2">
          {ROWS.map((row) => (
            <View
              key={row.id}
              className="flex-row items-center justify-between rounded-2xl bg-elevated px-3 py-2 dark:bg-d-elevated"
            >
              <Text className="text-sm text-muted-foreground dark:text-d-muted">
                {row.label}
              </Text>
              <Text className="text-sm font-bold tabular-nums text-foreground dark:text-d-text">
                {formatCurrency(breakdown[row.id], currency)}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

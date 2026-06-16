import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { RangeTabs } from "@/components/feature/stats/RangeTabs";
import { StatBlock } from "@/components/feature/stats/StatBlock";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { StatsFilterRange } from "@/types/stats/userStats";
import type { StatsOverviewByRange } from "@/types/stats/statsOverview";
import { formatCurrency, formatDuration, formatLifeGained, formatNumber } from "@/utils/shared/format";

type Props = {
  currency: string;
  byRange: StatsOverviewByRange;
};

export function StatsOverviewCard({ currency, byRange }: Props) {
  const { colors } = useTheme();
  const [range, setRange] = useState<StatsFilterRange>("lifetime");

  const impact = byRange[range];

  const smokeFreeHours = impact.durationSeconds / 3600;

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="stats-chart" size={18} color={colors.white} />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              Overview
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <RangeTabs variant="filter" value={range} onChange={setRange} />
        </View>

        <View key={range} className="mt-4 gap-3">
          <View className="flex-row gap-3">
            <StatBlock
              label="Money saved"
              value={impact.moneySaved}
              display={formatCurrency(impact.moneySaved, currency)}
              icon="cash"
              accent="primary"
              delay={0}
            />
            <StatBlock
              label="Cigarettes avoided"
              value={impact.cigarettesAvoided}
              display={formatNumber(impact.cigarettesAvoided)}
              icon="ban"
              accent="secondary"
              delay={40}
            />
          </View>

          <View className="flex-row gap-3">
            <StatBlock
              label="Life gained"
              value={impact.lifeMinutesGained}
              display={formatLifeGained(impact.lifeMinutesGained)}
              icon="heart"
              accent="accent"
              delay={80}
            />
            <StatBlock
              label="Smoke-free time"
              value={smokeFreeHours}
              display={formatDuration(smokeFreeHours)}
              icon="time"
              accent="secondary"
              delay={120}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

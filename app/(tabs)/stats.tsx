import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingTimeChart } from "@/components/feature/stats/CravingTimeChart";
import { SavingsBreakdownCard } from "@/components/feature/stats/SavingsBreakdownCard";
import { SavingsChartCard } from "@/components/feature/stats/SavingsChartCard";
import { StatsSummaryGrid } from "@/components/feature/stats/StatsSummaryGrid";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useCravingSummary, useStats } from "@/hooks/useStats";
import { useStatsDashboard } from "@/hooks/useStatsDashboard";

export default function Stats() {
  const { state } = useApp();
  const stats = useStats();
  const cravingSummary = useCravingSummary();
  const dashboard = useStatsDashboard();

  if (!stats || !state.profile || !dashboard) return null;

  const currency = state.profile.currency;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader title="Your Stats" />

        <View className="mt-6 gap-4 px-6">
          <StatsSummaryGrid
            moneySaved={stats.moneySaved}
            cigarettesAvoided={stats.cigarettesAvoided}
            hoursReclaimed={stats.minutesReclaimed / 60}
            cravingsHandled={cravingSummary.resisted}
            currency={currency}
          />

          <SavingsChartCard
            range={dashboard.range}
            onRangeChange={dashboard.setRange}
            series={dashboard.series}
            currency={currency}
          />

          <SavingsBreakdownCard
            breakdown={dashboard.savings}
            currency={currency}
          />

          <CravingTimeChart buckets={dashboard.cravingBuckets} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

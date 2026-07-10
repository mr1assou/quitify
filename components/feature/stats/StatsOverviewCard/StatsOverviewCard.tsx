import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { StatBlock } from "@/components/feature/stats/StatBlock";
import { Card } from "@/components/ui/Card";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTheme } from "@/context/ThemeContext";
import type { StatsOverviewByRange } from "@/types/stats/statsOverview";
import { formatCurrency, formatDuration, formatLifeGained, formatNumber } from "@/utils/shared/format";
import { formatStreakDuration } from "@/utils/streak";

type Props = {
  currency: string;
  byRange: StatsOverviewByRange;
  isPremium: boolean;
};

export function StatsOverviewCard({ currency, byRange, isPremium }: Props) {
  const { colors } = useTheme();
  const { requirePremium } = usePremiumGate();
  const impact = byRange.lifetime;

  const smokeFreeHours = impact.durationSeconds / 3600;
  const smokeFreeDisplay =
    impact.durationSeconds < 3600
      ? formatStreakDuration(impact.durationSeconds * 1000)
      : formatDuration(smokeFreeHours);

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
            <Text className="mt-0.5 text-sm text-muted-foreground dark:text-d-muted">
              Stats of all attempts
            </Text>
          </View>
        </View>

        <View className="mt-4 gap-3">
          <View className="flex-row gap-3">
            <StatBlock
              label="Money saved"
              value={impact.moneySaved}
              display={formatCurrency(impact.moneySaved, currency)}
              icon="cash"
              accent="primary"
              delay={0}
              locked={!isPremium}
              onLockedPress={requirePremium}
            />
            <StatBlock
              label="Cigarettes avoided"
              value={impact.cigarettesAvoided}
              display={formatNumber(impact.cigarettesAvoided)}
              icon="smoking"
              iconSet="materialCommunity"
              accent="primary"
              delay={40}
              locked={!isPremium}
              onLockedPress={requirePremium}
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
              locked={!isPremium}
              onLockedPress={requirePremium}
            />
            <StatBlock
              label="Smoke-free time"
              value={smokeFreeHours}
              display={smokeFreeDisplay}
              icon="time"
              accent="primary"
              delay={120}
              locked={!isPremium}
              onLockedPress={requirePremium}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

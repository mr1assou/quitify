import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AchievementProgressRings } from "@/components/feature/progress/AchievementProgressRings";
import { AttemptHistoryCard } from "@/components/feature/stats/AttemptHistoryCard";
import { GoalHistoryCard } from "@/components/feature/stats/GoalHistoryCard";
import { StatsOverviewCard } from "@/components/feature/stats/StatsOverviewCard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import { useProgress } from "@/hooks/progress/useProgress";
import { useRefreshAccount } from "@/hooks/auth/useRefreshAccount";
import { useStatsAttempts } from "@/hooks/stats/useStatsAttempts";
import { useStatsGoals } from "@/hooks/stats/useStatsGoals";
import { useStatsOverview } from "@/hooks/stats/useStatsOverview";
import { computeAchievementBadgeSummary } from "@/utils/progress/achievementProgress";
import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";
import { exactGlobalRankFromLeaderboard } from "@/utils/leaderboard/exactGlobalRank";

function SectionError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="items-center gap-4 rounded-2xl bg-section px-4 py-8 dark:bg-d-surface">
      <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">{message}</Text>
      <Pressable onPress={onRetry} className="rounded-2xl bg-primary px-5 py-3">
        <Text className="text-sm font-semibold text-white">Try again</Text>
      </Pressable>
    </View>
  );
}

export default function Stats() {
  const { colors } = useTheme();
  const { state } = useApp();
  const progress = useProgress();
  const { snapshot: leaderboard, refresh: refreshLeaderboard } = useLeaderboard();
  const refreshAccount = useRefreshAccount();
  const overview = useStatsOverview();
  const attempts = useStatsAttempts();
  const goals = useStatsGoals();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshAccount();
    }, [refreshAccount]),
  );

  const badgeSummary = progress
    ? computeAchievementBadgeSummary(progress, state.isPremium)
    : null;

  const displayRank = useMemo(() => {
    if (!progress || !leaderboard) return null;
    return exactGlobalRankFromLeaderboard(leaderboard, progress.rank);
  }, [leaderboard, progress]);

  const profile = state.profile;
  const timeZone =
    attempts.data?.timezone || goals.data?.timezone || getDeviceTimezone();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refreshAccount(),
      refreshLeaderboard(),
      overview.refresh(),
      attempts.refresh(),
      goals.refresh(),
    ]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.background}
          />
        }
      >
        <ScreenHeader leading={<AppBrandMark />} />

        <Text className="mt-4 px-6 text-lg font-semibold text-foreground dark:text-d-text">
          Your Stats
        </Text>

        <View className="mt-4 gap-4 px-6">
          {badgeSummary && progress ? (
            <AchievementProgressRings
              badge={badgeSummary.badge}
              freedomPoints={badgeSummary.freedomPoints}
              currentBadgeId={badgeSummary.currentBadgeId}
              rank={displayRank}
            />
          ) : null}

          {overview.loading && !overview.data ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : overview.error && !overview.data ? (
            <SectionError message={overview.error} onRetry={() => void overview.refresh()} />
          ) : overview.data ? (
            <StatsOverviewCard currency={overview.data.currency} byRange={overview.data.byRange} />
          ) : null}

          {attempts.loading && !attempts.data ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : attempts.error && !attempts.data ? (
            <SectionError message={attempts.error} onRetry={() => void attempts.refresh()} />
          ) : attempts.data && profile ? (
            <AttemptHistoryCard
              attempts={attempts.data.attempts}
              economics={attempts.data.economics}
              currency={attempts.data.currency}
              timeZone={timeZone}
            />
          ) : null}

          {goals.loading && !goals.data ? (
            <View className="items-center py-10">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : goals.error && !goals.data ? (
            <SectionError message={goals.error} onRetry={() => void goals.refresh()} />
          ) : goals.data ? (
            <GoalHistoryCard
              goals={goals.data.goals}
              currency={goals.data.currency}
              timeZone={timeZone}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

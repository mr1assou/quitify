import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AttemptHistoryCard } from "@/components/feature/stats/AttemptHistoryCard";
import { SlipsHistoryCard } from "@/components/feature/stats/SlipsHistoryCard";
import { StatsOverviewCard } from "@/components/feature/stats/StatsOverviewCard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { useUserStats } from "@/hooks/useUserStats";
import { getDeviceTimezone } from "@/utils/device/getDeviceTimezone";

export default function Stats() {
  const { colors } = useTheme();
  const { state } = useApp();
  const { data, loading, error, refresh } = useUserStats();
  const [refreshing, setRefreshing] = useState(false);

  const profile = state.profile;
  const timeZone = data?.timezone || getDeviceTimezone();
  const economics =
    data?.economics ??
    (profile
      ? {
          cigarettesPerDay: profile.cigarettesPerDay,
          cigarettesPerPack: profile.cigarettesPerPack,
          packCost: profile.packCost,
        }
      : undefined);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
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
          {loading && !data ? (
            <View className="items-center py-16">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : error && !data ? (
            <View className="items-center gap-4 py-16">
              <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                {error}
              </Text>
              <Pressable
                onPress={() => void refresh()}
                className="rounded-2xl bg-primary px-5 py-3"
              >
                <Text className="text-sm font-semibold text-white">Try again</Text>
              </Pressable>
            </View>
          ) : data && profile && economics ? (
            <>
              <StatsOverviewCard
                currency={data.currency}
                attempts={data.attempts}
                slips={data.slips}
                economics={economics}
              />

              <SlipsHistoryCard slips={data.slips} timeZone={timeZone} />

              <AttemptHistoryCard
                attempts={data.attempts}
                slips={data.slips}
                economics={economics}
                currency={data.currency}
                timeZone={timeZone}
              />
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

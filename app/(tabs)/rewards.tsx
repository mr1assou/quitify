import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { AchievementSectionTabs } from "@/components/feature/achievement/AchievementSectionTabs";
import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { AchievementSection } from "@/constants/progress/achievementSections";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/leaderboard/useLeaderboard";
import { useRefreshAccount } from "@/hooks/auth/useRefreshAccount";
import { useProgress } from "@/hooks/progress/useProgress";

export default function AchievementScreen() {
  const { colors } = useTheme();
  const progress = useProgress();
  const refreshAccount = useRefreshAccount();
  const {
    snapshot: leaderboard,
    loading,
    hasMore,
    loadingMore,
    loadMore,
    refresh,
    loadUntilCurrentUserRank,
  } = useLeaderboard();
  const [section, setSection] = useState<AchievementSection>("rank");

  useFocusEffect(
    useCallback(() => {
      void refreshAccount();
      if (section === "rank") {
        void refresh();
      }
    }, [refresh, refreshAccount, section]),
  );

  const handleSectionChange = (next: AchievementSection) => {
    setSection(next);
    if (next === "rank") {
      void refresh();
    }
  };

  if (!progress) return null;

  const sectionTabs = (
    <View className="mt-6 px-6">
      <AchievementSectionTabs value={section} onChange={handleSectionChange} />
    </View>
  );

  if (section === "rank") {
    return (
      <ScreenCanvas edges={["top"]}>
        {loading && !leaderboard ? (
          <View className="flex-1">
            <ScreenHeader leading={<AppBrandMark />} />
            {sectionTabs}
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          </View>
        ) : leaderboard ? (
          <RankLeaderboard
            leaderboard={leaderboard}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
            onLoadUntilCurrentUserRank={loadUntilCurrentUserRank}
            listHeader={
              <>
                <ScreenHeader leading={<AppBrandMark />} />
                {sectionTabs}
              </>
            }
          />
        ) : (
          <View className="flex-1">
            <ScreenHeader leading={<AppBrandMark />} />
            {sectionTabs}
          </View>
        )}
      </ScreenCanvas>
    );
  }

  return (
    <ScreenCanvas edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader leading={<AppBrandMark />} />
        {sectionTabs}
        <View className="mt-4 gap-4 px-6">
          <NextBadgeCard
            currentBadge={progress.currentBadge}
            progress={progress.currentBadgeProgress}
            hasNextTarget={Boolean(progress.nextBadge)}
          />
          <BadgesGallery badges={progress.badges} />
        </View>
      </ScrollView>
    </ScreenCanvas>
  );
}

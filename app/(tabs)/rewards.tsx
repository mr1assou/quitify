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
    viewMode,
    loadMore,
    refresh,
    spotAroundCurrentUser,
  } = useLeaderboard();
  const [section, setSection] = useState<AchievementSection>("rank");

  useFocusEffect(
    useCallback(() => {
      void refreshAccount();
      void refresh();
    }, [refresh, refreshAccount]),
  );

  if (!progress) return null;

  const showRank = section === "rank";

  return (
    <ScreenCanvas edges={["top"]}>
      <ScreenHeader leading={<AppBrandMark />} />
      <View className="mt-6 px-6">
        <AchievementSectionTabs value={section} onChange={setSection} />
      </View>

      <View
        className="flex-1"
        style={{ display: showRank ? "flex" : "none" }}
        pointerEvents={showRank ? "auto" : "none"}
        accessibilityElementsHidden={!showRank}
        importantForAccessibility={showRank ? "auto" : "no-hide-descendants"}
      >
        {leaderboard ? (
          <RankLeaderboard
            leaderboard={leaderboard}
            hasMore={hasMore}
            loadingMore={loadingMore}
            viewMode={viewMode}
            onLoadMore={loadMore}
            onSpotAroundCurrentUser={spotAroundCurrentUser}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}
          </View>
        )}
      </View>

      <View
        className="flex-1"
        style={{ display: showRank ? "none" : "flex" }}
        pointerEvents={showRank ? "none" : "auto"}
        accessibilityElementsHidden={showRank}
        importantForAccessibility={showRank ? "no-hide-descendants" : "auto"}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="mt-4 gap-4 px-6">
            <NextBadgeCard
              currentBadge={progress.currentBadge}
              progress={progress.currentBadgeProgress}
              hasNextTarget={Boolean(progress.nextBadge)}
            />
            <BadgesGallery badges={progress.badges} />
          </View>
        </ScrollView>
      </View>
    </ScreenCanvas>
  );
}

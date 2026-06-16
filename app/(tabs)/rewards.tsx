import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AchievementSectionTabs } from "@/components/feature/achievement/AchievementSectionTabs";
import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { AchievementSection } from "@/constants/achievementSections";
import { useTheme } from "@/context/ThemeContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProgress } from "@/hooks/useProgress";
import { useRefreshAccount } from "@/hooks/useRefreshAccount";

export default function AchievementScreen() {
  const { colors } = useTheme();
  const progress = useProgress();
  const refreshAccount = useRefreshAccount();
  const { snapshot: leaderboard, loading, hasMore, loadingMore, loadMore } = useLeaderboard();
  const [section, setSection] = useState<AchievementSection>("rank");

  useFocusEffect(
    useCallback(() => {
      void refreshAccount();
    }, [refreshAccount]),
  );

  if (!progress) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader leading={<AppBrandMark />} />

        <View className="mt-6 gap-4 px-6">
          <AchievementSectionTabs value={section} onChange={setSection} />

          {section === "rank" ? (
            loading && !leaderboard ? (
              <View className="items-center py-16">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : leaderboard ? (
              <RankLeaderboard
                leaderboard={leaderboard}
                hasMore={hasMore}
                loadingMore={loadingMore}
                onLoadMore={loadMore}
              />
            ) : (
              <View className="items-center py-16">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )
          ) : (
            <>
              <NextBadgeCard
                currentBadge={progress.currentBadge}
                progress={progress.currentBadgeProgress}
                hasNextTarget={Boolean(progress.nextBadge)}
              />
              <BadgesGallery badges={progress.badges} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

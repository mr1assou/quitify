import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AchievementSectionTabs } from "@/components/feature/achievement/AchievementSectionTabs";
import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { AchievementSection } from "@/constants/achievementSections";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProgress } from "@/hooks/useProgress";

export default function AchievementScreen() {
  const progress = useProgress();
  const leaderboard = useLeaderboard();
  const [section, setSection] = useState<AchievementSection>("rank");

  if (!progress) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader leading={<AppBrandMark />} />

        <View className="mt-6 gap-4 px-6">
          <AchievementSectionTabs value={section} onChange={setSection} />

          {section === "rank" ? (
            leaderboard ? (
              <RankLeaderboard leaderboard={leaderboard} />
            ) : (
              <View className="items-center py-16">
                <ActivityIndicator />
              </View>
            )
          ) : (
            <>
              <NextBadgeCard badge={progress.nextBadge} />
              <BadgesGallery badges={progress.badges} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

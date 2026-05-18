import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AchievementSectionTabs } from "@/components/feature/achievement/AchievementSectionTabs";
import { AchievementProgressRings } from "@/components/feature/progress/AchievementProgressRings";
import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { RankLeaderboard } from "@/components/feature/progress/RankLeaderboard";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { AchievementSection } from "@/constants/achievementSections";
import { useApp } from "@/context/AppContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useProgress } from "@/hooks/useProgress";
import { computeAchievementBadgeSummary } from "@/utils/achievementProgress";

const HEADER: Record<AchievementSection, { title: string }> = {
  rank: { title: "Your rank" },
  badges: { title: "Your badges" },
};

export default function AchievementScreen() {
  const { state } = useApp();
  const progress = useProgress();
  const leaderboard = useLeaderboard();
  const [section, setSection] = useState<AchievementSection>("rank");

  if (!progress || !leaderboard) return null;

  const header = HEADER[section];
  const badgeSummary = computeAchievementBadgeSummary(progress, state.isPremium);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader title={header.title} />

        <View className="mt-6 gap-4 px-6">
          <AchievementSectionTabs value={section} onChange={setSection} />

          {section === "rank" ? (
            <>
              <AchievementProgressRings
                badge={badgeSummary.badge}
                freedomPoints={badgeSummary.freedomPoints}
                currentBadgeId={badgeSummary.currentBadgeId}
              />
              <RankLeaderboard leaderboard={leaderboard} />
            </>
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

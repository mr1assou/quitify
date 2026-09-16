import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { AchievementSectionTabs } from "@/components/feature/achievement/AchievementSectionTabs";
import { AwardsRankSection } from "@/components/feature/achievement/AwardsRankSection";
import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { AchievementSection } from "@/constants/progress/achievementSections";
import { useRefreshAccount } from "@/hooks/auth/useRefreshAccount";
import { useProgress } from "@/hooks/progress/useProgress";

export default function AchievementScreen() {
  const progress = useProgress();
  const refreshAccount = useRefreshAccount();
  const [section, setSection] = useState<AchievementSection>("badges");
  /** Keep Rank mounted after first open so tab switches stay instant. */
  const [rankMounted, setRankMounted] = useState(false);

  const refreshAccountRef = useRef(refreshAccount);
  refreshAccountRef.current = refreshAccount;

  useFocusEffect(
    useCallback(() => {
      void refreshAccountRef.current();
    }, []),
  );

  const onSectionChange = useCallback((next: AchievementSection) => {
    if (next === "rank") setRankMounted(true);
    setSection(next);
  }, []);

  if (!progress) return null;

  const showRank = section === "rank";

  return (
    <ScreenCanvas edges={["top"]}>
      <ScreenHeader leading={<AppBrandMark />} />
      <View className="mt-6 px-6">
        <AchievementSectionTabs value={section} onChange={onSectionChange} />
      </View>

      {rankMounted ? (
        <View
          className="flex-1"
          style={{ display: showRank ? "flex" : "none" }}
          pointerEvents={showRank ? "auto" : "none"}
          accessibilityElementsHidden={!showRank}
          importantForAccessibility={showRank ? "auto" : "no-hide-descendants"}
        >
          <AwardsRankSection active={showRank} />
        </View>
      ) : null}

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

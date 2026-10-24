import { useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { BadgesGallery } from "@/components/feature/progress/BadgesGallery";
import { NextBadgeCard } from "@/components/feature/progress/NextBadgeCard";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { useRefreshAccount } from "@/hooks/auth/useRefreshAccount";
import { useProgress } from "@/hooks/progress/useProgress";

export default function BadgesScreen() {
  const { colors } = useTheme();
  const progress = useProgress();
  const refreshAccount = useRefreshAccount();
  const refreshAccountRef = useRef(refreshAccount);
  refreshAccountRef.current = refreshAccount;

  useFocusEffect(
    useCallback(() => {
      void refreshAccountRef.current();
    }, []),
  );

  return (
    <ScreenCanvas edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      >
        <ScreenHeader leading={<AppBrandMark />} />
        {progress ? (
          <View className="mt-4 gap-4 px-6">
            <NextBadgeCard
              currentBadge={progress.currentBadge}
              progress={progress.currentBadgeProgress}
              hasNextTarget={Boolean(progress.nextBadge)}
            />
            <BadgesGallery badges={progress.badges} />
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </ScreenCanvas>
  );
}

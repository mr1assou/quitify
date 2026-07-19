import { useFocusEffect } from "expo-router";
import type { UserGoal } from "@/types/goals/goal";
import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { HomeGoalsSection } from "@/components/feature/home/HomeGoalsSection";
import { CravingActions } from "@/components/feature/home/CravingActions";
import { RecoveryHighlights } from "@/components/feature/home/RecoveryHighlights";
import { StreakHero } from "@/components/feature/home/StreakHero";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useGates } from "@/hooks/app/useGates";
import { usePostSignupPaywall } from "@/hooks/onboarding/usePostSignupPaywall";
import { useUserGoals } from "@/hooks/goals/useUserGoals";
import { usePostPaywallNotificationPrompt } from "@/hooks/push/usePostPaywallNotificationPrompt";
import { useStats } from "@/hooks/stats/useStats";
import { getStreakElapsedMs } from "@/utils/streak/elapsedBreakdown";
import { smokeFreeDaysInProgressFromStreakStart } from "@/utils/goals/goalStreakProgress";
import { currencySymbol } from "@/utils/shared/format";

export default function Home() {
  const stats = useStats(1_000);
  const { state, setFlag } = useApp();
  const gates = useGates();
  const { activeGoals, progress, hasOpenGoalSlot, isReady: goalsReady } = useUserGoals();
  usePostSignupPaywall();
  usePostPaywallNotificationPrompt();

  const openCreateGoal = useCallback(() => {
    safeRouter.push("/goals");
  }, []);

  const openManageGoal = useCallback((goal: UserGoal) => {
    safeRouter.pushStack({
      pathname: "/goals/[id]",
      params: { id: String(goal.id) },
    });
  }, []);

  const goalProgress = useMemo(
    () =>
      goalsReady
        ? progress
        : {
            moneySaved: stats?.moneySaved ?? 0,
            smokeFreeDays: stats?.streakDays ?? 0,
            smokeFreeDaysInProgress: state.profile?.streakStart
              ? smokeFreeDaysInProgressFromStreakStart(state.profile.streakStart)
              : 0,
            cigarettesAvoided: stats?.cigarettesAvoided ?? 0,
            elapsedSmokeFreeMs: state.profile?.streakStart
              ? getStreakElapsedMs(state.profile.streakStart)
              : 0,
          },
    [goalsReady, progress, stats, state.profile?.streakStart],
  );

  useFocusEffect(
    useCallback(() => {
      if (!state.account && gates.shouldShowSignup) {
        setFlag("hasSeenSignupPrompt", true);
        const t = setTimeout(() => safeRouter.push("/signup"), 250);
        return () => clearTimeout(t);
      }
      if (gates.shouldShowPaywall) {
        setFlag("hasSeenPaywall", true);
        const t = setTimeout(() => safeRouter.push("/paywall"), 250);
        return () => clearTimeout(t);
      }
    }, [state.account, gates.shouldShowSignup, gates.shouldShowPaywall, setFlag]),
  );

  if (!stats || !state.profile) return null;

  const symbol = currencySymbol(state.profile.currency);

  return (
    <ScreenCanvas edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ScreenHeader leading={<AppBrandMark />} />

        <View className="mt-6 px-6">
          <StreakHero
            streakStart={state.profile.streakStart}
            attemptNumber={state.profile.currentAttemptNumber}
            moneySaved={stats.moneySaved}
            cigarettesAvoided={stats.cigarettesAvoided}
            lifeMinutesGained={stats.lifeMinutesGained}
            currencySymbol={symbol}
          />
        </View>

        <View className="mt-8 px-6">
          <RecoveryHighlights />
        </View>

        <View className="mt-10 px-6">
          <CravingActions />
        </View>

        <View className="mt-10 px-6">
          <HomeGoalsSection
            goals={activeGoals}
            progress={goalProgress}
            currencySymbol={symbol}
            hasOpenGoalSlot={hasOpenGoalSlot}
            isLoadingGoals={!goalsReady}
            onCreateGoal={openCreateGoal}
            onGoalPress={openManageGoal}
          />
        </View>
      </ScrollView>
    </ScreenCanvas>
  );
}

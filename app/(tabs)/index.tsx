import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingActions } from "@/components/feature/home/CravingActions";
import { RecoveryHighlights } from "@/components/feature/home/RecoveryHighlights";
import { StreakHero } from "@/components/feature/home/StreakHero";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useApp } from "@/context/AppContext";
import { useGates } from "@/hooks/useGates";
import { useStats } from "@/hooks/useStats";
import { currencySymbol } from "@/utils/format";

export default function Home() {
  const stats = useStats(1_000);
  const { state, setFlag } = useApp();
  const gates = useGates();

  useFocusEffect(
    useCallback(() => {
      if (gates.shouldShowSignup) {
        setFlag("hasSeenSignupPrompt", true);
        const t = setTimeout(() => router.push("/signup"), 250);
        return () => clearTimeout(t);
      }
      if (gates.shouldShowPaywall) {
        setFlag("hasSeenPaywall", true);
        const t = setTimeout(() => router.push("/paywall"), 250);
        return () => clearTimeout(t);
      }
    }, [gates.shouldShowSignup, gates.shouldShowPaywall, setFlag]),
  );

  if (!stats || !state.profile) return null;

  const symbol = currencySymbol(state.profile.currency);
  const greeting = state.account?.name
    ? `Hi ${state.account.name.split(" ")[0]}`
    : "You're doing great";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader eyebrow="Home" title={greeting} />

        <View className="mt-6 px-6">
          <StreakHero
            streakStart={state.profile.streakStart}
            moneySaved={stats.moneySaved}
            cigarettesAvoided={stats.cigarettesAvoided}
            lifeMinutesGained={stats.lifeMinutesGained}
            currencySymbol={symbol}
          />
        </View>

        <View className="mt-8 px-6">
          <CravingActions />
        </View>

        <View className="mt-10 px-6">
          <RecoveryHighlights />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

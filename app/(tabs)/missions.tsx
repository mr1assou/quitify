import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MissionPlanModuleSection } from "@/components/feature/missions/MissionPlanModuleSection";
import { PlanDayLockedModal } from "@/components/feature/missions/PlanDayLockedModal";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { PLAN_PREVIEW_UNLOCK_ALL } from "@/config/plan";
import { useTheme } from "@/context/ThemeContext";
import { useMissionPlan } from "@/hooks/progress/useMissionPlan";
import { safeRouter } from "@/utils/app/safeRouter";

export default function Missions() {
  const { colors } = useTheme();
  const plan = useMissionPlan();

  const openDay = (day: number) => {
    if (!PLAN_PREVIEW_UNLOCK_ALL && day > plan.unlockedThroughDay) {
      plan.showLockedDayMessage(day);
      return;
    }
    plan.selectDay(day);
    safeRouter.pushStack({
      pathname: "/plan-day/[day]",
      params: { day: String(day) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-d-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader leading={<AppBrandMark />} />

        {plan.planLoading && plan.unlockedThroughDay <= 0 ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {!plan.hasQuitStreak ? (
              <View className="mx-6 mt-4 rounded-2xl bg-section px-4 py-4 dark:bg-d-surface">
                <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                  Set your quit date during onboarding to unlock your 180-day plan.
                </Text>
              </View>
            ) : plan.unlockedThroughDay <= 0 ? (
              <View className="mx-6 mt-4 rounded-2xl bg-section px-4 py-4 dark:bg-d-surface">
                <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                  Your plan unlocks when your quit day begins. Day 2 and later unlock at 7 AM in
                  your local time after you finish the previous day.
                </Text>
              </View>
            ) : null}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 4 }}
            >
              {plan.modules.map((module) => {
                const selected = module.chapterNumber === plan.selectedModule;
                return (
                  <Pressable
                    key={module.chapterNumber}
                    onPress={() => plan.selectModule(module.chapterNumber)}
                    className={`mr-2 rounded-full border px-4 py-2 ${
                      selected
                        ? "border-primary bg-primary"
                        : "border-section bg-section dark:border-d-surface dark:bg-d-surface"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selected
                          ? "text-white"
                          : "text-foreground dark:text-d-text"
                      }`}
                    >
                      Module {module.chapterNumber}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <MissionPlanModuleSection plan={plan} onSelectDay={openDay} />
          </>
        )}
      </ScrollView>

      <PlanDayLockedModal
        content={plan.lockedDayModal}
        onClose={plan.closeLockedDayModal}
      />
    </SafeAreaView>
  );
}

import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { MissionPlanModuleSection } from "@/components/feature/missions/MissionPlanModuleSection";
import { MissionPlanNotesButton } from "@/components/feature/missions/MissionPlanNotesButton";
import { PlanDayLockedModal } from "@/components/feature/missions/PlanDayLockedModal";
import { AppBrandMark } from "@/components/layout/AppBrandMark";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { useOpenPlanDay } from "@/hooks/progress/useOpenPlanDay";
import { useMissionPlan } from "@/hooks/progress/useMissionPlan";
import { usePlanTaskNotes } from "@/hooks/progress/usePlanTaskNotes";
import { safeRouter } from "@/utils/app/safeRouter";

export default function Missions() {
  const { colors } = useTheme();
  const plan = useMissionPlan();
  const { noteCount } = usePlanTaskNotes();
  const { openDay, lockedDayModal, closeLockedDayModal } = useOpenPlanDay();

  return (
    <ScreenCanvas edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ScreenHeader leading={<AppBrandMark />} />

        {plan.planLoading && plan.unlockedThroughDay <= 0 ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {!plan.hasQuitStreak ? (
              <View className="mx-6 mt-4 rounded-2xl border border-border/50 bg-white/88 px-4 py-4 dark:border-d-border/60 dark:bg-d-surface/90">
                <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                  Set your quit date during onboarding to unlock your 180-day plan.
                </Text>
              </View>
            ) : plan.unlockedThroughDay <= 0 ? (
              <View className="mx-6 mt-4 rounded-2xl border border-border/50 bg-white/88 px-4 py-4 dark:border-d-border/60 dark:bg-d-surface/90">
                <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
                  Your plan unlocks when your quit day begins. Day 2 and later unlock at 7 AM in
                  your local time after you finish the previous day.
                </Text>
              </View>
            ) : null}

            <View className="flex-row items-center pt-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-1"
                contentContainerStyle={{ paddingLeft: 24, paddingRight: 8, paddingBottom: 4 }}
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

              <View className="pr-6">
                <MissionPlanNotesButton
                  noteCount={noteCount}
                  onPress={() => safeRouter.push("/plan-notes")}
                />
              </View>
            </View>

            <MissionPlanModuleSection plan={plan} onSelectDay={openDay} />
          </>
        )}
      </ScrollView>

      <PlanDayLockedModal
        content={lockedDayModal}
        onClose={closeLockedDayModal}
      />
    </ScreenCanvas>
  );
}

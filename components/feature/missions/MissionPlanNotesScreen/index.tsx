import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MissionPlanNoteCard } from "@/components/feature/missions/MissionPlanNoteCard";
import { PlanDayLockedModal } from "@/components/feature/missions/PlanDayLockedModal";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { StackScreenHeader } from "@/components/layout/StackScreenHeader";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useOpenPlanDay } from "@/hooks/progress/useOpenPlanDay";
import { usePlanTaskNotes } from "@/hooks/progress/usePlanTaskNotes";
import type { PlanTaskNote } from "@/utils/progress/planTaskNotes";

export function MissionPlanNotesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { notes, loading, refresh } = usePlanTaskNotes();
  const { openDay, lockedDayModal, closeLockedDayModal } = useOpenPlanDay();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const listBottom = Math.max(insets.bottom, 16) + 16;

  const renderItem = ({ item }: { item: PlanTaskNote }) => (
    <MissionPlanNoteCard entry={item} onPress={() => openDay(item.planDay)} />
  );

  return (
    <ScreenCanvas edges={["top"]}>
      <StackScreenHeader title={t("missions.yourNotes")} />

      {loading && notes.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => `${item.planDay}-${item.taskId}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: listBottom,
            flexGrow: notes.length === 0 ? 1 : undefined,
          }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-4 py-16">
              <Text className="text-center text-base font-semibold text-foreground dark:text-d-text">
                {t("missions.notesEmpty")}
              </Text>
              <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                {t("missions.notesEmptyHint")}
              </Text>
            </View>
          }
        />
      )}

      <PlanDayLockedModal content={lockedDayModal} onClose={closeLockedDayModal} />
    </ScreenCanvas>
  );
}

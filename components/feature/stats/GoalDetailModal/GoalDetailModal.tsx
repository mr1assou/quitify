import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { GoalStatsRow } from "@/types/stats/statsGoals";
import {
  buildGoalDetailRows,
  formatGoalStatsTitle,
  goalStatusLabel,
} from "@/utils/stats/goalPresentation";

type Props = {
  goal: GoalStatsRow | null;
  currency: string;
  timeZone: string;
  onClose: () => void;
};

export function GoalDetailModal({ goal, currency, timeZone, onClose }: Props) {
  const { t, locale } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    onClose();
  };

  const detailRows = goal ? buildGoalDetailRows(goal, currency, timeZone, t, locale) : [];
  const isActive = goal?.status === "active";
  const isCompleted = goal?.status === "completed";

  return (
    <Modal
      visible={goal !== null}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={handleClose} />

        <View
          className="max-h-[85%] rounded-t-3xl bg-background px-6 pt-5 dark:bg-d-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {goal ? (
            <>
              <View className="mb-4 items-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                  <Ionicons name="flag" size={26} color={colors.white} />
                </View>
                <Text className="mt-4 px-2 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {formatGoalStatsTitle(goal, currency, t)}
                </Text>
                <View
                  className={`mt-2 rounded-full px-3 py-1 ${
                    isActive
                      ? "bg-accent/20"
                      : isCompleted
                        ? "bg-primary/20"
                        : "bg-section dark:bg-d-surface"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isActive
                        ? "text-accent"
                        : isCompleted
                          ? "text-primary"
                          : "text-muted-foreground dark:text-d-muted"
                    }`}
                  >
                    {goalStatusLabel(goal.status, t)}
                  </Text>
                </View>
              </View>

              <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                <View className="gap-2">
                  {detailRows.map((row) => (
                    <DetailRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </View>
              </ScrollView>

              <View className="mt-5">
                <Button label={t("common.close")} onPress={handleClose} fullWidth />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
      <Text className="mr-4 flex-1 text-sm text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <Text className="max-w-[58%] text-right text-sm font-semibold text-foreground dark:text-d-text">
        {value}
      </Text>
    </View>
  );
}

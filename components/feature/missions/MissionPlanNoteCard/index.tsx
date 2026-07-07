import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { missionPlanLabel } from "@/constants/progress/plan";
import { useTheme } from "@/context/ThemeContext";
import type { PlanTaskNote } from "@/utils/progress/planTaskNotes";

type Props = {
  entry: PlanTaskNote;
  onPress: () => void;
};

export function MissionPlanNoteCard({ entry, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-border/60 bg-section px-4 py-3 active:opacity-80 dark:border-d-border/60 dark:bg-d-surface/90"
    >
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-xs font-semibold uppercase tracking-wide text-primary">
          {missionPlanLabel(entry.planDay)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      </View>

      <Text className="mt-1 text-sm font-semibold text-foreground dark:text-d-text">
        {entry.taskTitle}
      </Text>

      <Text
        className="mt-1 text-sm leading-5 text-muted-foreground dark:text-d-muted"
        numberOfLines={4}
      >
        {entry.note}
      </Text>
    </Pressable>
  );
}

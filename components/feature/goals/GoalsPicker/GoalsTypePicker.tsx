import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { GOAL_TYPES } from "@/constants/goals/goals";
import { useTheme } from "@/context/ThemeContext";
import type { GoalType } from "@/types/goals/goal";

type Props = {
  onPickType: (type: GoalType) => void;
  lockedTypes?: readonly GoalType[];
  heading?: string;
};

export function GoalsTypePicker({
  onPickType,
  lockedTypes = [],
  heading = "Choose a goal",
}: Props) {
  const { colors } = useTheme();
  const locked = new Set(lockedTypes);

  return (
    <View className="gap-3">
      <Text className="mb-1 text-center text-xl font-bold text-foreground dark:text-d-text">
        {heading}
      </Text>

      {GOAL_TYPES.map((goalType) => {
        const isLocked = locked.has(goalType.id);

        if (isLocked) {
          return (
            <View
              key={goalType.id}
              className="flex-row items-center justify-between rounded-2xl bg-section px-4 py-4 opacity-60 dark:bg-d-surface"
            >
              <View className="min-w-0 flex-1 flex-row items-center gap-3">
                <Ionicons name={goalType.icon} size={22} color={colors.mutedForeground} />
                <View className="min-w-0 flex-1">
                  <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
                    {goalType.title}
                  </Text>
                  <Text className="mt-0.5 text-sm text-muted-foreground dark:text-d-muted">
                    This goal is already created
                  </Text>
                </View>
              </View>
              <Ionicons name="lock-closed" size={18} color={colors.mutedForeground} />
            </View>
          );
        }

        return (
          <Pressable
            key={goalType.id}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onPickType(goalType.id);
            }}
            className="flex-row items-center justify-between rounded-2xl bg-section px-4 py-4 dark:bg-d-surface"
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name={goalType.icon} size={22} color={colors.primary} />
              <Text className="text-base font-semibold text-foreground dark:text-d-text">
                {goalType.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
          </Pressable>
        );
      })}
    </View>
  );
}

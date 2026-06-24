import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";
import type { ResolvedPlanTask } from "@/types";

type Props = {
  task: ResolvedPlanTask;
  onToggle: (taskId: string, value: boolean) => void;
};

export function TaskRow({ task, onToggle }: Props) {
  const { colors } = useTheme();

  const onPress = () => {
    Haptics.selectionAsync().catch(() => {});
    onToggle(task.id, !task.done);
  };

  return (
    <Animated.View layout={LinearTransition.springify().damping(18)}>
      <Pressable
        onPress={onPress}
        className="flex-row items-center rounded-2xl bg-background p-3 active:opacity-70 dark:bg-d-elevated"
      >
        <View
          className={`mr-3 h-7 w-7 items-center justify-center rounded-full ${
            task.done ? "bg-accent" : "bg-section dark:bg-d-surface"
          }`}
        >
          {task.done ? (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          ) : null}
        </View>
        <Text
          className={`flex-1 text-sm ${
            task.done
              ? "text-muted-foreground line-through dark:text-d-muted"
              : "text-foreground dark:text-d-text"
          }`}
        >
          {task.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

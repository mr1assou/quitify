import { Text, View } from "react-native";

import { ProgressBar } from "@/components/ui/ProgressBar";

type Props = {
  completed: number;
  total: number;
  progress: number;
};

export function DailyFocusHeader({ completed, total, progress }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Today&apos;s focus
      </Text>
      <View className="mt-1 flex-row items-end justify-between">
        <Text className="text-3xl font-bold text-foreground dark:text-d-text">
          {completed}
          <Text className="text-base font-semibold text-muted-foreground dark:text-d-muted">
            {" "}
            / {total}
          </Text>
        </Text>
        <Text className="pb-1 text-xs text-muted-foreground dark:text-d-muted">
          missions completed
        </Text>
      </View>
      <View className="mt-3">
        <ProgressBar progress={progress} />
      </View>
    </View>
  );
}

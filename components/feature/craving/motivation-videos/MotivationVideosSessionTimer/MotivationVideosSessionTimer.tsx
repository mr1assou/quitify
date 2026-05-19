import { Text, View } from "react-native";

import { formatDurationMs } from "@/utils/formatDuration";

type Props = {
  elapsedMs: number;
};

export function MotivationVideosSessionTimer({ elapsedMs }: Props) {
  return (
    <View className="items-center">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Session time
      </Text>
      <Text className="mt-1 text-3xl font-bold tabular-nums text-foreground dark:text-d-text">
        {formatDurationMs(elapsedMs)}
      </Text>
    </View>
  );
}

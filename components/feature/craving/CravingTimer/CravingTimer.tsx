import { Text, View } from "react-native";

import { ProgressRing } from "@/components/ui/ProgressRing";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  totalSeconds: number;
  remainingSeconds: number;
};

export function CravingTimer({ totalSeconds, remainingSeconds }: Props) {
  const { colors } = useTheme();
  const progress = 1 - remainingSeconds / Math.max(1, totalSeconds);
  const mm = Math.floor(remainingSeconds / 60);
  const ss = Math.max(0, Math.floor(remainingSeconds % 60));
  const label = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <ProgressRing
      progress={progress}
      size={220}
      strokeWidth={14}
      color={colors.primary}
      trackColor={colors.border}
    >
      <View className="items-center">
        <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Stay with it
        </Text>
        <Text className="mt-1 text-6xl font-bold tabular-nums text-foreground dark:text-d-text">
          {label}
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground dark:text-d-muted">
          This will pass
        </Text>
      </View>
    </ProgressRing>
  );
}

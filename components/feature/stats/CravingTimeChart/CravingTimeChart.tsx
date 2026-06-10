import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { CravingTimeBucket } from "@/types/statsDashboard";

type Props = {
  buckets: CravingTimeBucket[];
  title?: string;
  emptyMessage?: string;
};

export function CravingTimeChart({
  buckets,
  title = "Cravings by time of day",
  emptyMessage = "No cravings logged yet.",
}: Props) {
  const { colors } = useTheme();
  const total = buckets.reduce((sum, b) => sum + b.count, 0);
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const peak = total === 0 ? null : buckets.reduce((a, b) => (b.count > a.count ? b : a));

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <Card variant="section">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-accent">
            <Ionicons name="alarm" size={18} color={colors.white} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {title}
            </Text>
            <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">
              {total === 0
                ? emptyMessage
                : `Peak time: ${peak?.label.toLowerCase()} · ${total} total`}
            </Text>
          </View>
        </View>

        <View className="mt-4 gap-2">
          {buckets.map((b) => (
            <BucketRow key={b.id} bucket={b} max={max} />
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

function BucketRow({ bucket, max }: { bucket: CravingTimeBucket; max: number }) {
  const ratio = bucket.count / max;
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-foreground dark:text-d-text">
          {bucket.label}
        </Text>
        <Text className="text-xs tabular-nums text-muted-foreground dark:text-d-muted">
          {bucket.count}
        </Text>
      </View>
      <View className="mt-1 h-2 w-full overflow-hidden rounded-full bg-background dark:bg-d-elevated">
        <View
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.max(2, ratio * 100)}%` }}
        />
      </View>
    </View>
  );
}

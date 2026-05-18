import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Card } from "@/components/ui/Card";

type Bar = {
  day: string;
  resisted: number;
  smoked: number;
};

type Props = {
  data: Bar[];
  title?: string;
  subtitle?: string;
};

export function SimpleGraph({ data, title = "Last 7 days", subtitle }: Props) {
  const max = Math.max(1, ...data.map((d) => d.resisted + d.smoked));

  return (
    <Card variant="section">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-0.5 text-sm text-foreground dark:text-d-text">{subtitle}</Text>
      ) : null}

      <View className="mt-4 flex-row items-end justify-between" style={{ height: 120 }}>
        {data.map((d, i) => {
          const total = d.resisted + d.smoked;
          const resistedRatio = total === 0 ? 0 : d.resisted / total;
          return (
            <View key={d.day} className="flex-1 items-center px-1">
              <View className="w-full flex-1 justify-end overflow-hidden rounded-xl bg-background dark:bg-d-elevated">
                <BarFill ratio={total / max} resistedRatio={resistedRatio} delay={i * 60} />
              </View>
              <Text className="mt-2 text-[10px] text-muted-foreground dark:text-d-muted">
                {labelForDay(d.day)}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mt-3 flex-row items-center justify-end gap-3">
        <Legend color="bg-accent" label="Resisted" />
        <Legend color="bg-alert" label="Smoked" />
      </View>
    </Card>
  );
}

function BarFill({
  ratio,
  resistedRatio,
  delay,
}: {
  ratio: number;
  resistedRatio: number;
  delay: number;
}) {
  const h = useSharedValue(0);
  useEffect(() => {
    const t = setTimeout(() => {
      h.value = withTiming(ratio, { duration: 600 });
    }, delay);
    return () => clearTimeout(t);
  }, [ratio, delay, h]);

  const style = useAnimatedStyle(() => ({
    height: `${h.value * 100}%`,
  }));

  return (
    <Animated.View style={style} className="w-full overflow-hidden rounded-xl">
      <View style={{ flex: resistedRatio }} className="w-full bg-accent" />
      <View style={{ flex: 1 - resistedRatio }} className="w-full bg-alert" />
    </Animated.View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center">
      <View className={`mr-1 h-2 w-2 rounded-full ${color}`} />
      <Text className="text-[10px] text-muted-foreground dark:text-d-muted">{label}</Text>
    </View>
  );
}

function labelForDay(key: string): string {
  const [, , day] = key.split("-");
  return day;
}

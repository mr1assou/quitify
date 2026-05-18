import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

type Props = {
  total: number;
  active: number;
};

export function IntroDots({ total, active }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} active={i === active} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    width: withTiming(active ? 24 : 8, { duration: 260 }),
    opacity: withTiming(active ? 1 : 0.35, { duration: 260 }),
  }));

  return (
    <Animated.View
      style={style}
      className={`h-2 rounded-full ${
        active ? "bg-primary" : "bg-secondary dark:bg-d-border"
      }`}
    />
  );
}

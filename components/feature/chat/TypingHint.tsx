import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  name: string;
};

/** Subtle "X is typing…" placeholder used when a thread is empty. */
export function TypingHint({ name }: Props) {
  const a = useSharedValue(0.3);
  const b = useSharedValue(0.3);
  const c = useSharedValue(0.3);

  useEffect(() => {
    a.value = withRepeat(
      withSequence(withTiming(1, { duration: 300 }), withTiming(0.3, { duration: 300 })),
      -1,
      false,
    );
    b.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 150 }),
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 }),
      ),
      -1,
      false,
    );
    c.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 300 }),
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 }),
      ),
      -1,
      false,
    );
  }, [a, b, c]);

  const aStyle = useAnimatedStyle(() => ({ opacity: a.value }));
  const bStyle = useAnimatedStyle(() => ({ opacity: b.value }));
  const cStyle = useAnimatedStyle(() => ({ opacity: c.value }));

  return (
    <View className="flex-row items-center self-start rounded-full bg-section px-3 py-2 dark:bg-d-surface">
      <Text className="text-xs text-muted-foreground dark:text-d-muted">{name} is typing</Text>
      <View className="ml-2 flex-row">
        <Animated.Text style={aStyle} className="text-muted-foreground">
          .
        </Animated.Text>
        <Animated.Text style={bStyle} className="text-muted-foreground">
          .
        </Animated.Text>
        <Animated.Text style={cStyle} className="text-muted-foreground">
          .
        </Animated.Text>
      </View>
    </View>
  );
}

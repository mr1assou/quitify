import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
};

function TypingDot({ delayMs }: { delayMs: number }) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 320, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.35, { duration: 320, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [delayMs, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={style}
      className="mx-0.5 h-1.5 w-1.5 rounded-full bg-muted-foreground dark:bg-d-muted"
    />
  );
}

/** WhatsApp-style typing row above the composer. */
export function ChatTypingIndicator({ label }: Props) {
  return (
    <View className="flex-row items-center px-4 pb-2 pt-1">
      <View className="flex-row items-center rounded-full bg-section px-3 py-2 dark:bg-d-surface">
        <Text className="mr-2 text-xs text-muted-foreground dark:text-d-muted">{label}</Text>
        <TypingDot delayMs={0} />
        <TypingDot delayMs={160} />
        <TypingDot delayMs={320} />
      </View>
    </View>
  );
}

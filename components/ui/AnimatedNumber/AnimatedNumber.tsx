import { useEffect } from "react";
import { Text, type TextProps } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = TextProps & {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/**
 * Worklet-safe number tween. Formatting is done inside a worklet, so only
 * `toFixed` + string concat are supported here. Use `display` on the parent
 * for richer formatting (e.g. locale-aware, currency).
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 700,
  ...rest
}: Props) {
  const v = useSharedValue(value);

  useEffect(() => {
    v.value = withTiming(value, { duration });
  }, [value, duration, v]);

  const animatedProps = useAnimatedProps(() => {
    const out = `${prefix}${v.value.toFixed(decimals)}${suffix}`;
    return { text: out, defaultValue: out } as Partial<TextProps>;
  });

  return (
    <AnimatedText
      {...rest}
      animatedProps={animatedProps}
      editable={false}
      selectable={false}
    />
  );
}

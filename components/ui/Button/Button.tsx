import { type ReactNode, useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/context/ThemeContext";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  preventDoublePress?: boolean;
  /** Soft press scale + opacity feedback. */
  pressScale?: boolean;
  /**
   * Keep the pressed look after tap (no bounce-back). Use for screen navigations
   * so the release animation does not look like a second click.
   */
  holdPressFeedback?: boolean;
  loading?: boolean;
};

const containerByVariant: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-accent-soft border border-border/60 dark:border-transparent dark:bg-primary",
  ghost: "bg-transparent border border-border dark:border-d-border",
  danger: "bg-alert",
  accent: "bg-accent",
};

const textByVariant: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-foreground dark:text-d-text",
  ghost: "text-foreground dark:text-d-text",
  danger: "text-white",
  accent: "text-white",
};

const sizeContainer: Record<Size, string> = {
  sm: "px-4 py-2 rounded-xl",
  md: "px-5 py-3 rounded-2xl",
  lg: "px-6 py-4 rounded-2xl",
};

const sizeText: Record<Size, string> = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-lg font-bold",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leading,
  trailing,
  preventDoublePress = true,
  pressScale = true,
  holdPressFeedback = false,
  loading = false,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const pressLockedRef = useRef(false);
  const holdPressedRef = useRef(false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const isDisabled = Boolean(disabled || loading);
  const spinnerColor =
    variant === "ghost" || variant === "secondary" ? colors.primary : colors.white;

  useEffect(() => {
    opacity.value = withTiming(isDisabled ? 0.5 : 1, { duration: 120 });
    scale.value = withTiming(1, { duration: 120 });
  }, [isDisabled, opacity, scale]);

  return (
    <AnimatedPressable
      {...rest}
      disabled={isDisabled}
      onPressIn={() => {
        if (isDisabled || !pressScale || holdPressedRef.current) return;
        scale.value = withTiming(0.97, { duration: 70 });
        opacity.value = withTiming(0.88, { duration: 70 });
      }}
      onPressOut={() => {
        if (isDisabled || !pressScale) return;
        if (holdPressedRef.current) return;
        scale.value = withTiming(1, { duration: 120 });
        opacity.value = withTiming(1, { duration: 120 });
      }}
      onPress={(e) => {
        if (isDisabled) return;
        if (preventDoublePress && pressLockedRef.current) return;
        if (preventDoublePress) {
          pressLockedRef.current = true;
          setTimeout(() => {
            pressLockedRef.current = false;
          }, 700);
        }
        if (holdPressFeedback && pressScale) {
          holdPressedRef.current = true;
        }
        onPress?.(e);
      }}
      style={pressScale ? animatedStyle : undefined}
      className={[
        "flex-row items-center justify-center",
        sizeContainer[size],
        containerByVariant[variant],
        fullWidth ? "w-full" : "self-start",
      ].join(" ")}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {leading}
          <Text
            className={[sizeText[size], textByVariant[variant], leading ? "ml-2" : ""].join(" ")}
          >
            {label}
          </Text>
          {trailing}
        </>
      )}
    </AnimatedPressable>
  );
}

import * as Haptics from "expo-haptics";
import { type ReactNode, useRef } from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
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
  haptic?: boolean;
  preventDoublePress?: boolean;
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
  haptic = false,
  preventDoublePress = true,
  loading = false,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const pressLockedRef = useRef(false);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === "ghost" || variant === "secondary" ? colors.primary : colors.white;

  return (
    <AnimatedPressable
      {...rest}
      disabled={isDisabled}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 280 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={(e) => {
        if (preventDoublePress && pressLockedRef.current) return;
        if (preventDoublePress) {
          pressLockedRef.current = true;
          setTimeout(() => {
            pressLockedRef.current = false;
          }, 700);
        }
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      style={animatedStyle}
      className={[
        "flex-row items-center justify-center",
        sizeContainer[size],
        containerByVariant[variant],
        fullWidth ? "w-full" : "self-start",
        isDisabled ? "opacity-50" : "",
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

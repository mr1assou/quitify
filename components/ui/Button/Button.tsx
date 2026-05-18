import * as Haptics from "expo-haptics";
import { type ReactNode } from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
};

const containerByVariant: Record<Variant, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary dark:bg-primary",
  ghost: "bg-transparent border border-secondary dark:border-d-border",
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
  haptic = true,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 280 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.(e);
      }}
      style={animatedStyle}
      className={[
        "flex-row items-center justify-center",
        sizeContainer[size],
        containerByVariant[variant],
        fullWidth ? "w-full" : "self-start",
        disabled ? "opacity-50" : "",
      ].join(" ")}
    >
      {leading}
      <Text className={[sizeText[size], textByVariant[variant], leading ? "ml-2" : ""].join(" ")}>
        {label}
      </Text>
      {trailing}
    </AnimatedPressable>
  );
}

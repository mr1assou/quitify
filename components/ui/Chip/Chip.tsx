import * as Haptics from "expo-haptics";
import { Pressable, Text } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
  size?: "default" | "lg";
  fullWidth?: boolean;
};

export function Chip({
  label,
  selected = false,
  onPress,
  emoji,
  size = "default",
  fullWidth = false,
}: Props) {
  const isLg = size === "lg";
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(18)}
      className={fullWidth ? "w-full" : undefined}
    >
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onPress?.();
        }}
        className={[
          "flex-row items-center rounded-full border",
          fullWidth ? "w-full justify-center" : "self-start",
          isLg ? "px-7 py-3.5" : "px-4 py-2",
          selected
            ? "border-primary bg-primary"
            : "border-secondary dark:border-d-border bg-background dark:bg-d-elevated",
        ].join(" ")}
      >
        {emoji ? (
          <Text className={[isLg ? "mr-2.5 text-lg" : "mr-2 text-base"].join(" ")}>{emoji}</Text>
        ) : null}
        <Text
          className={[
            isLg ? "text-lg font-bold" : "text-sm font-semibold",
            fullWidth ? "text-center" : "",
            selected ? "text-white" : "text-foreground dark:text-d-text",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

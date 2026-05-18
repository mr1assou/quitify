import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, suffix }: Props) {
  const { colors } = useTheme();

  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped !== value) {
      Haptics.selectionAsync().catch(() => {});
      onChange(clamped);
    }
  };

  return (
    <View className="flex-row items-center justify-center">
      <Pressable
        onPress={() => set(value - step)}
        className="h-14 w-14 items-center justify-center rounded-full bg-section active:opacity-70 dark:bg-d-surface"
      >
        <Ionicons name="remove" size={24} color={colors.foreground} />
      </Pressable>
      <View className="mx-6 min-w-[120px] items-center">
        <Text className="text-5xl font-bold text-foreground dark:text-d-text">{value}</Text>
        {suffix ? (
          <Text className="mt-1 text-xs uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            {suffix}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={() => set(value + step)}
        className="h-14 w-14 items-center justify-center rounded-full bg-primary active:opacity-80"
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </Pressable>
    </View>
  );
}

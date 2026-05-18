import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";

type Props = {
  isRunning: boolean;
  cycle: number;
  onToggle: () => void;
  onReset: () => void;
};

export function BreathingControls({ isRunning, cycle, onToggle, onReset }: Props) {
  const { colors } = useTheme();

  return (
    <View className="items-center gap-6">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        Cycle {cycle}
      </Text>

      <View className="flex-row items-center gap-6">
        <ControlButton
          icon="refresh"
          label="Restart"
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onReset();
          }}
          color={colors.mutedForeground}
        />
        <ControlButton
          icon={isRunning ? "pause" : "play"}
          label={isRunning ? "Pause" : "Resume"}
          size={72}
          filled
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onToggle();
          }}
          color={colors.white}
        />
        <View className="h-12 w-12" />
      </View>
    </View>
  );
}

function ControlButton({
  icon,
  label,
  onPress,
  color,
  filled = false,
  size = 48,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
  filled?: boolean;
  size?: number;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: filled ? colors.accent : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={filled ? "active:opacity-90" : "active:opacity-60"}
    >
      <Ionicons name={icon} size={filled ? 30 : 22} color={color} />
    </Pressable>
  );
}

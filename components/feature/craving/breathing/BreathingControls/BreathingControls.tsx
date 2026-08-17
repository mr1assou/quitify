import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  isRunning: boolean;
  cycle: number;
  onToggle: () => void;
  onReset: () => void;
};

export function BreathingControls({ isRunning, cycle, onToggle, onReset }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="items-center gap-6">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {t("craving.breathingCycle", { count: cycle })}
      </Text>

      <View className="flex-row items-center gap-6">
        <ControlButton
          icon="refresh"
          label={t("craving.breathingRestart")}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onReset();
          }}
          color={colors.mutedForeground}
        />
        <ControlButton
          icon={isRunning ? "pause" : "play"}
          label={isRunning ? t("craving.breathingPause") : t("craving.breathingResume")}
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

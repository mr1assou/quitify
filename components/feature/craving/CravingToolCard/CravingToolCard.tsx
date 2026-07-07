import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { CravingToolVariant } from "@/constants/craving/cravingTools";
import { useTheme } from "@/context/ThemeContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: CravingToolVariant;
  loading?: boolean;
  onPress: () => void;
};

const CARD_VARIANT: Record<
  CravingToolVariant,
  { card: string; iconWrap: string; iconUsesPrimary: boolean }
> = {
  soft: {
    card: "bg-accent-soft dark:bg-d-accent-soft",
    iconWrap: "bg-primary",
    iconUsesPrimary: false,
  },
  warm: {
    card: "bg-section dark:bg-d-surface",
    iconWrap: "bg-secondary dark:bg-primary-light",
    iconUsesPrimary: false,
  },
  bold: {
    card: "bg-primary/10 dark:bg-primary/20",
    iconWrap: "bg-primary",
    iconUsesPrimary: false,
  },
  outline: {
    card: "border border-border bg-section dark:border-d-border dark:bg-d-surface",
    iconWrap: "bg-accent-soft dark:bg-d-accent-soft",
    iconUsesPrimary: true,
  },
};

export function CravingToolCard({
  label,
  description,
  icon,
  variant,
  loading = false,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const styles = CARD_VARIANT[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = styles.iconUsesPrimary ? colors.primary : colors.white;
  const loadingColor = styles.iconUsesPrimary ? colors.primary : colors.white;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${description}`}
      accessibilityState={{ busy: loading }}
      disabled={loading}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={[{ flexBasis: "48%" }, animatedStyle]}
      className={`rounded-3xl p-4 ${styles.card}`}
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-2xl ${styles.iconWrap}`}
      >
        {loading ? (
          <ActivityIndicator size="small" color={loadingColor} />
        ) : (
          <Ionicons name={icon} size={24} color={iconColor} />
        )}
      </View>

      <Text className="mt-3 text-base font-bold text-foreground dark:text-d-text">
        {label}
      </Text>
      <Text className="mt-0.5 text-xs text-muted-foreground dark:text-d-muted">
        {description}
      </Text>
    </AnimatedPressable>
  );
}

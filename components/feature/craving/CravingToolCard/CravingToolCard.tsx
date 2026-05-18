import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { CravingToolColors } from "@/constants/cravingTools";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: CravingToolColors;
  onPress: () => void;
};

export function CravingToolCard({
  label,
  description,
  icon,
  colors,
  onPress,
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${description}`}
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
      style={[
        {
          flexBasis: "48%",
          backgroundColor: colors.background,
          borderRadius: 24,
          padding: 16,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.iconBackground,
        }}
      >
        <Ionicons name={icon} size={24} color={colors.iconColor} />
      </View>

      <Text
        style={{ color: colors.iconColor }}
        className="mt-3 text-base font-bold"
      >
        {label}
      </Text>
      <Text
        style={{ color: colors.iconColor, opacity: 0.75 }}
        className="mt-0.5 text-xs"
      >
        {description}
      </Text>
    </AnimatedPressable>
  );
}

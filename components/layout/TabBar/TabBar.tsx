import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/context/ThemeContext";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  missions: "flag",
  community: "people",
  stats: "stats-chart",
  rewards: "trophy",
};

const CIRCLE = 48;
const RADIUS = CIRCLE / 2;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center justify-around border-t border-section bg-background px-2 pt-2 dark:border-d-border dark:bg-d-bg"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const iconName = ICONS[route.name] ?? "ellipse";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            Haptics.selectionAsync().catch(() => {});
            navigation.navigate(route.name);
          }
        };

        return (
          <TabButton
            key={route.key}
            icon={iconName}
            focused={focused}
            label={typeof options.title === "string" ? options.title : route.name}
            onPress={onPress}
            mutedColor={colors.mutedForeground}
            whiteColor={colors.white}
            sectionColor={colors.section}
            primaryColor={colors.primary}
          />
        );
      })}
    </View>
  );
}

function TabButton({
  icon,
  focused,
  label,
  onPress,
  mutedColor,
  whiteColor,
  sectionColor,
  primaryColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  label: string;
  onPress: () => void;
  mutedColor: string;
  whiteColor: string;
  sectionColor: string;
  primaryColor: string;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 16, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 220 });
      }}
      onPress={onPress}
      style={{ flex: 1 }}
      className="items-center justify-center py-2"
    >
      {({ pressed }) => {
        let bg = "transparent";
        if (focused) bg = primaryColor;
        else if (pressed) bg = sectionColor;

        const fg = focused ? whiteColor : mutedColor;

        return (
          <Animated.View
            style={[
              animatedStyle,
              {
                width: CIRCLE,
                height: CIRCLE,
                borderRadius: RADIUS,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: bg,
              },
            ]}
          >
            <Ionicons name={icon} size={focused ? 22 : 24} color={fg} />
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

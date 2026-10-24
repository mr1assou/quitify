import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useTheme } from "@/context/ThemeContext";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  missions: "map",
  community: "people",
  stats: "stats-chart",
  rewards: "ellipsis-horizontal",
};

const CIRCLE = 48;
const RADIUS = CIRCLE / 2;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const openMoreDestination = (routeName: "badges" | "global-rank") => {
    setMoreMenuOpen(false);
    navigation.navigate(routeName);
  };

  const currentRouteName = state.routes[state.index]?.name;
  const isMoreDestination = currentRouteName === "badges" || currentRouteName === "global-rank";

  return (
    <>
      <View
        className="flex-row items-center justify-around border-t border-border/80 bg-section/95 px-2 pt-2 dark:border-d-border/80 dark:bg-d-surface/90"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      >
        {state.routes
          .map((route, index) => ({ route, index }))
          .filter(({ route }) => route.name !== "badges" && route.name !== "global-rank")
          .map(({ route, index }) => {
            const isMore = route.name === "rewards";
            const routeFocused = state.index === index;
            const focused = moreMenuOpen
              ? isMore
              : routeFocused || (isMore && isMoreDestination);
            const { options } = descriptors[route.key];
            const iconName = ICONS[route.name] ?? "ellipse";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (event.defaultPrevented) return;

              if (isMore) {
                setMoreMenuOpen((open) => !open);
                return;
              }

              setMoreMenuOpen(false);
              if (!routeFocused) navigation.navigate(route.name);
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

      <Modal
        transparent
        visible={moreMenuOpen}
        animationType="fade"
        onRequestClose={() => setMoreMenuOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityLabel={t("common.close")}
            onPress={() => setMoreMenuOpen(false)}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          />
          <View
            className="px-4"
            style={{ paddingBottom: Math.max(insets.bottom, 8) + 80 }}
          >
            <View className="self-end rounded-2xl border border-border bg-elevated p-2 shadow-xl dark:border-d-border dark:bg-d-elevated">
              <MoreMenuItem
                icon="ribbon-outline"
                title={t("achievements.tabBadges")}
                onPress={() => openMoreDestination("badges")}
              />
              <MoreMenuItem
                icon="podium-outline"
                title={t("achievements.tabRank")}
                onPress={() => openMoreDestination("global-rank")}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function MoreMenuItem({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="min-w-[180px] flex-row items-center rounded-xl px-3 py-3 active:bg-section dark:active:bg-d-surface"
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View className="ml-3 flex-1">
        <Text className="text-sm font-bold text-foreground dark:text-d-text">{title}</Text>
      </View>
    </Pressable>
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

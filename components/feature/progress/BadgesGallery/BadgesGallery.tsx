import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BadgeDetailModal } from "@/components/feature/progress/BadgeDetailModal";
import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeWithStatus } from "@/types/progress";

type Props = {
  badges: BadgeWithStatus[];
};

export function BadgesGallery({ badges }: Props) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithStatus | null>(null);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <Animated.View entering={FadeInDown.duration(420)}>
      <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      <Card variant="section">
        <View className="mb-3 flex-row items-end justify-between">
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Badges
          </Text>
          <Text className="text-xs font-semibold text-foreground dark:text-d-text">
            {unlockedCount} / {badges.length}
          </Text>
        </View>

        <View className="flex-row flex-wrap" style={{ marginHorizontal: -4 }}>
          {badges.map((badge, idx) => (
            <View key={badge.id} className="w-1/3 px-1 py-1" style={{ height: BADGE_TILE_HEIGHT }}>
              <BadgeTile
                badge={badge}
                delay={idx * 40}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setSelectedBadge(badge);
                }}
              />
            </View>
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

const BADGE_ART_SIZE = 72;

/** Fixed tile height so long badge names don’t stretch one card in a row. */
const BADGE_TILE_HEIGHT = 124;

function BadgeStatusIcon({ unlocked }: { unlocked: boolean }) {
  const { colors } = useTheme();

  return (
    <View
      className={`absolute -right-0.5 -top-0.5 h-5 w-5 items-center justify-center rounded-full ${
        unlocked ? "bg-accent" : "bg-section dark:bg-d-surface"
      }`}
      style={
        unlocked
          ? undefined
          : { borderWidth: 1, borderColor: colors.border }
      }
    >
      <Ionicons
        name={unlocked ? "checkmark" : "lock-closed"}
        size={unlocked ? 12 : 10}
        color={unlocked ? colors.white : colors.mutedForeground}
      />
    </View>
  );
}

function BadgeTile({
  badge,
  delay,
  onPress,
}: {
  badge: BadgeWithStatus;
  delay: number;
  onPress: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(delay).springify().damping(18)}
      className="flex-1"
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${badge.name} badge details`}
        className="h-full items-center justify-center gap-1.5 rounded-2xl bg-background px-1.5 py-2 active:opacity-80 dark:bg-d-elevated"
      >
        <View>
          <BadgeArt badgeId={badge.id} size={BADGE_ART_SIZE} />
          <BadgeStatusIcon unlocked={badge.unlocked} />
        </View>
        <View className="h-8 w-full justify-center px-0.5">
          <Text
            className="text-center text-[10px] font-semibold leading-tight text-foreground dark:text-d-text"
            numberOfLines={2}
          >
            {badge.name}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

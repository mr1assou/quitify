import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeWithStatus } from "@/types/progress";
import { pluralize } from "@/utils/format";

type Props = {
  badge: BadgeWithStatus | null;
  onClose: () => void;
};

function requirementText(badge: BadgeWithStatus): string {
  if (badge.unlocked) {
    return "You've earned this badge. Nice work — keep your streak going.";
  }

  const days = badge.daysRequired;
  const dayLabel = `${days} ${pluralize(days, "smoke-free day")}`;

  if (badge.premium) {
    return `To unlock this badge, stay smoke-free for ${dayLabel}. This is a Premium badge.`;
  }

  return `To get this badge, stay smoke-free for ${dayLabel}.`;
}

export function BadgeDetailModal({ badge, onClose }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  return (
    <Modal visible={badge !== null} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={handleClose} />
        <View
          className="rounded-t-3xl bg-background px-6 pt-5 dark:bg-d-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {badge ? (
            <>
              <View className="mb-4 items-center">
                <View>
                  <BadgeArt badgeId={badge.id} size={96} />
                  <View
                    className={`absolute -right-1 -top-1 h-6 w-6 items-center justify-center rounded-full ${
                      badge.unlocked ? "bg-accent" : "bg-section dark:bg-d-surface"
                    }`}
                    style={
                      badge.unlocked
                        ? undefined
                        : { borderWidth: 1, borderColor: colors.border }
                    }
                  >
                    <Ionicons
                      name={badge.unlocked ? "checkmark" : "lock-closed"}
                      size={badge.unlocked ? 14 : 12}
                      color={badge.unlocked ? colors.white : colors.mutedForeground}
                    />
                  </View>
                </View>

                <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {badge.name}
                </Text>

                <View
                  className={`mt-2 rounded-full px-3 py-1 ${
                    badge.unlocked ? "bg-accent/20" : "bg-section dark:bg-d-surface"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-wider ${
                      badge.unlocked ? "text-accent" : "text-muted-foreground dark:text-d-muted"
                    }`}
                  >
                    {badge.unlocked ? "Earned" : "Locked"}
                  </Text>
                </View>
              </View>

              <Text className="text-center text-sm leading-6 text-muted-foreground dark:text-d-muted">
                {badge.description}
              </Text>

              <View className="mt-4 rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                  How to get it
                </Text>
                <Text className="mt-1 text-sm leading-5 text-foreground dark:text-d-text">
                  {requirementText(badge)}
                </Text>
              </View>

              {!badge.unlocked && badge.daysLeft > 0 ? (
                <Text className="mt-3 text-center text-xs text-muted-foreground dark:text-d-muted">
                  {badge.daysLeft} {pluralize(badge.daysLeft, "day")} to go
                </Text>
              ) : null}

              <View className="mt-5">
                <Button label="Got it" onPress={handleClose} fullWidth />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BadgeArt } from "@/components/feature/progress/BadgeArt";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  FIRST_STEP_REQUIREMENTS,
  isBadgeGalleryAvailable,
  isFirstStepBadge,
} from "@/constants/badges";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import type { BadgeWithStatus } from "@/types/progress";
import { formatNumber, pluralize } from "@/utils/format";

type Props = {
  badge: BadgeWithStatus | null;
  hasAccount: boolean;
  hasCommittedToQuit: boolean;
  onClose: () => void;
};

function RequirementRow({
  label,
  valueLabel,
  progress,
  met,
  showProgress = true,
}: {
  label: string;
  valueLabel: string;
  progress: number;
  met: boolean;
  showProgress?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
      <View className="flex-row items-center gap-2">
        <Ionicons
          name={met ? "checkmark-circle" : "close-circle"}
          size={20}
          color={met ? colors.accent : colors.alert}
        />
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {label}
        </Text>
      </View>

      <Text className="mt-2 pl-7 text-sm font-semibold text-foreground dark:text-d-text">
        {valueLabel}
      </Text>

      {showProgress && !met ? (
        <View className="mt-2 pl-7">
          <ProgressBar progress={progress} fillClassName="bg-primary" />
        </View>
      ) : null}
    </View>
  );
}

export function BadgeDetailModal({ badge, hasAccount, hasCommittedToQuit, onClose }: Props) {
  const { colors } = useTheme();
  const { state } = useApp();
  const earnedBadgeIds = state.account?.earnedBadgeIds ?? [];
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  const earnable = badge ? isBadgeGalleryAvailable(badge.id, earnedBadgeIds) : false;
  const isFirstStep = badge ? isFirstStepBadge(badge.id) : false;

  const displayStreakMet =
    earnable && !isFirstStep && (badge?.unlocked || (badge?.streakProgress ?? 0) >= 1);
  const displayFpMet =
    earnable && !isFirstStep && (badge?.unlocked || (badge?.fpProgress ?? 0) >= 1);
  const displayStreakProgress = earnable && !isFirstStep ? (badge?.streakProgress ?? 0) : 0;
  const displayFpProgress = earnable && !isFirstStep ? (badge?.fpProgress ?? 0) : 0;

  const statusLabel = !earnable
    ? "Locked"
    : badge?.unlocked
      ? "Earned"
      : isFirstStep
        ? hasCommittedToQuit
          ? "In progress"
          : "Available"
        : "In progress";

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
                      badge.unlocked && earnable ? "bg-accent" : "bg-section dark:bg-d-surface"
                    }`}
                    style={
                      badge.unlocked && earnable
                        ? undefined
                        : { borderWidth: 1, borderColor: colors.border }
                    }
                  >
                    <Ionicons
                      name={
                        badge.unlocked && earnable
                          ? "checkmark"
                          : earnable
                            ? "ellipse-outline"
                            : "lock-closed"
                      }
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
                    badge.unlocked && earnable ? "bg-accent/20" : "bg-section dark:bg-d-surface"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-wider ${
                      badge.unlocked && earnable
                        ? "text-accent"
                        : earnable
                          ? "text-primary"
                          : "text-muted-foreground dark:text-d-muted"
                    }`}
                  >
                    {statusLabel}
                  </Text>
                </View>
              </View>

              {isFirstStep ? (
                <Text className="mb-3 text-center text-sm leading-6 text-muted-foreground dark:text-d-muted">
                  This badge celebrates your decision to quit
                </Text>
              ) : null}

              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
                  Requirements
                </Text>

                {isFirstStep ? (
                  FIRST_STEP_REQUIREMENTS.map((requirement) => {
                    const met =
                      requirement.id === "register" ? hasAccount : hasCommittedToQuit;

                    return (
                      <RequirementRow
                        key={requirement.id}
                        label={requirement.label}
                        valueLabel={requirement.valueLabel}
                        progress={met ? 1 : 0}
                        met={met}
                        showProgress={false}
                      />
                    );
                  })
                ) : (
                  <>
                    <RequirementRow
                      label="Smoke-free streak"
                      valueLabel={`${badge.daysRequired} ${pluralize(badge.daysRequired, "day")}`}
                      progress={displayStreakProgress}
                      met={displayStreakMet}
                    />

                    <RequirementRow
                      label="Freedom Points"
                      valueLabel={`${formatNumber(badge.fpRequired)} FP`}
                      progress={displayFpProgress}
                      met={displayFpMet}
                    />
                  </>
                )}
              </View>

              {!badge.unlocked && !earnable ? (
                <Text className="mt-3 text-center text-xs text-muted-foreground dark:text-d-muted">
                  This badge is locked for now. Complete earlier badges to unlock it.
                </Text>
              ) : !badge.unlocked && isFirstStep ? (
                <Text className="mt-3 text-center text-xs text-muted-foreground dark:text-d-muted">
                  {hasCommittedToQuit
                    ? "Requirements complete — your badge unlocks on the next sync."
                    : "Register and choose to quit to earn this badge."}
                </Text>
              ) : !badge.unlocked ? (
                <Text className="mt-3 text-center text-xs text-muted-foreground dark:text-d-muted">
                  You need both requirements to earn this badge.
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

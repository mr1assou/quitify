import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { QuitStartPresetPicker } from "@/components/feature/onboarding/QuitPlanFields/QuitStartPresetPicker";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useQuitPlanHandlers } from "@/hooks/onboarding/useQuitPlanHandlers";
import type {
  QuitDateApiPayload,
  QuitStartDateDraft,
} from "@/types/onboarding/quitStartDate";
import {
  initialQuitStartDateDraft,
  isQuitStartDateComplete,
  resolveQuitDatePayload,
} from "@/utils/onboarding/resolveQuitDatePayload";

export type ResetJourneyModalState =
  | { type: "confirm" }
  | { type: "resetting" }
  | { type: "error"; title: string; message: string };

type Props = {
  state: ResetJourneyModalState | null;
  onClose: () => void;
  onConfirm?: (quitDate: QuitDateApiPayload) => void;
};

export function ResetJourneyModals({ state, onClose, onConfirm }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [quitDraft, setQuitDraft] = useState<QuitStartDateDraft>(() =>
    initialQuitStartDateDraft(),
  );

  const lossItems = useMemo(
    () => [
      t("profile.resetLossBadges"),
      t("profile.resetLossFp"),
      t("profile.resetLossGoals"),
      t("profile.resetLossAttempts"),
      t("profile.resetLossPlan"),
    ],
    [t],
  );

  useEffect(() => {
    if (state?.type === "confirm") {
      setQuitDraft(initialQuitStartDateDraft());
    }
  }, [state?.type]);

  const patchQuitDraft = (next: Partial<QuitStartDateDraft>) => {
    setQuitDraft((current) => ({ ...current, ...next }));
  };

  const quitHandlers = useQuitPlanHandlers(quitDraft, patchQuitDraft);
  const canConfirm = useMemo(() => isQuitStartDateComplete(quitDraft), [quitDraft]);

  if (!state) return null;

  const canDismiss = state.type !== "resetting";

  const handleClose = () => {
    if (!canDismiss) return;
    onClose();
  };

  const handleConfirm = () => {
    const payload = resolveQuitDatePayload(quitDraft);
    if (!payload) return;
    onConfirm?.(payload);
  };

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={canDismiss ? handleClose : undefined}
    >
      <View className="flex-1 items-center justify-center px-6">
        {canDismiss ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            className="absolute inset-0 bg-black/50"
            onPress={handleClose}
          />
        ) : (
          <View className="absolute inset-0 bg-black/50" />
        )}

        <View className="max-h-[90%] w-full max-w-sm overflow-hidden rounded-3xl bg-background dark:bg-d-bg">
          {state.type === "confirm" ? (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View className="px-6 py-7">
              <View className="items-center">
                <View
                  className="h-24 w-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.alert}18` }}
                >
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                    <Ionicons name="refresh-outline" size={32} color={colors.white} />
                  </View>
                </View>

                <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {t("profile.resetTitle")}
                </Text>
              </View>

              <View className="mt-5">
                <QuitStartPresetPicker
                  variant="stacked"
                  draft={quitDraft}
                  onSelectPreset={quitHandlers.selectPreset}
                  onMonthChange={quitHandlers.updateCustomMonth}
                  onDayChange={quitHandlers.updateCustomDay}
                  onYearChange={quitHandlers.updateCustomYear}
                />
              </View>

              <View className="mt-5 rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
                <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-d-muted">
                  {t("profile.resetWillLose")}
                </Text>
                <View className="mt-2 gap-1.5">
                  {lossItems.map((item) => (
                    <View key={item} className="flex-row items-start">
                      <Text className="mr-2 text-alert">•</Text>
                      <Text className="flex-1 text-sm leading-5 text-foreground dark:text-d-text">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mt-7 items-center gap-3">
                <Pressable
                  accessibilityRole="button"
                  disabled={!canConfirm}
                  onPress={handleConfirm}
                  className={`w-full rounded-2xl px-10 py-3.5 ${
                    canConfirm ? "bg-alert" : "bg-muted opacity-60"
                  }`}
                >
                  <Text className="text-center text-base font-bold text-white">
                    {t("profile.resetCta")}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleClose}
                  className="items-center py-2"
                >
                  <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                    {t("common.cancel")}
                  </Text>
                </Pressable>
              </View>
              </View>
            </ScrollView>
          ) : null}

          {state.type === "resetting" ? (
            <View className="items-center px-6 py-7">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="mt-5 text-center text-base font-semibold text-foreground dark:text-d-text">
                {t("profile.resetting")}
              </Text>
              <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
                {t("profile.resettingHint")}
              </Text>
            </View>
          ) : null}

          {state.type === "error" ? (
            <View className="px-6 py-7">
              <View className="items-center">
                <View
                  className="h-24 w-24 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.alert}18` }}
                >
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-alert">
                    <Ionicons name="alert-circle-outline" size={32} color={colors.white} />
                  </View>
                </View>

                <Text className="mt-5 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {state.title}
                </Text>
                <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
                  {state.message}
                </Text>
              </View>

              <View className="mt-7 items-center">
                <Pressable
                  accessibilityRole="button"
                  onPress={handleClose}
                  className="rounded-2xl bg-primary px-10 py-3.5"
                >
                  <Text className="text-center text-base font-bold text-white">
                    {t("common.gotIt")}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

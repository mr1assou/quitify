import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { GOAL_COMPLETION_BONUS } from "@/constants/goals/goalRewards";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translate";

type Props = {
  visible: boolean;
  daysAhead?: number;
  onClose: () => void;
};

const FP_PER_DAY = GOAL_COMPLETION_BONUS.FP_PER_DAY;

const TIER_KEYS = [
  { streak: "goals.infoTier0Streak", min: "goals.infoTier0Min" },
  { streak: "goals.infoTier1Streak", min: "goals.infoTier1Min" },
  { streak: "goals.infoTier2Streak", min: "goals.infoTier2Min" },
  { streak: "goals.infoTier3Streak", min: "goals.infoTier3Min" },
  { streak: "goals.infoTier4Streak", min: "goals.infoTier4Min" },
  { streak: "goals.infoTier5Streak", min: "goals.infoTier5Min" },
] as const satisfies ReadonlyArray<{ streak: TranslationKey; min: TranslationKey }>;

export function GoalDaysAheadInfoModal({ visible, daysAhead, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  const personalizedExample =
    daysAhead != null && daysAhead > 0
      ? t("goals.infoFpExampleForDays", {
          days: daysAhead,
          fp: daysAhead * FP_PER_DAY,
        })
      : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center px-5 py-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          className="absolute inset-0 bg-black/50"
          onPress={handleClose}
        />

        <View className="w-full max-w-md rounded-3xl bg-background px-6 pb-6 pt-7 dark:bg-d-bg">
          <View className="items-center">
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}22` }}
            >
              <Ionicons name="flag-outline" size={30} color={colors.primary} />
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
              {t("goals.infoTitle")}
            </Text>
          </View>

          <Text className="mt-4 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {t("goals.infoIntro")}
          </Text>

          <View className="mt-3 gap-2.5 rounded-2xl bg-section px-3.5 py-3.5 dark:bg-d-surface">
            {TIER_KEYS.map((tier) => (
              <View key={tier.streak} className="flex-row items-start gap-2">
                <Text className="w-[92px] text-sm font-semibold text-foreground dark:text-d-text">
                  {t(tier.streak)}
                </Text>
                <Text className="flex-1 text-sm text-muted-foreground dark:text-d-muted">
                  → {t(tier.min)}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mt-4 text-sm font-bold text-foreground dark:text-d-text">
            {t("goals.infoFpTitle")}
          </Text>
          <Text className="mt-1 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {t("goals.infoFpBody", { fpPerDay: FP_PER_DAY })}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {t("goals.infoFpExample", { fpPerDay: FP_PER_DAY })}
          </Text>

          {personalizedExample ? (
            <View className="mt-3 rounded-2xl bg-primary/15 px-3.5 py-3">
              <Text className="text-sm font-semibold leading-5 text-primary">
                {personalizedExample}
              </Text>
            </View>
          ) : null}

          <View className="mt-5">
            <Button label={t("common.gotIt")} onPress={handleClose} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const handleClose = () => {
    onClose();
  };

  const personalizedExample =
    daysAhead != null && daysAhead > 0
      ? t("goals.infoFpExampleForDays", {
          days: daysAhead,
          fp: daysAhead * FP_PER_DAY,
        })
      : null;

  const maxCardHeight = Math.min(windowHeight - insets.top - insets.bottom - 32, windowHeight * 0.9);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View
        className="flex-1 items-center justify-center px-5"
        style={{ paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          className="absolute inset-0 bg-black/50"
          onPress={handleClose}
        />

        <View
          className="w-full max-w-md overflow-hidden rounded-3xl bg-background dark:bg-d-bg"
          style={{ maxHeight: maxCardHeight }}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 }}
            showsVerticalScrollIndicator
            bounces
            nestedScrollEnabled
          >
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
                <View key={tier.streak} className="gap-0.5">
                  <Text className="text-sm font-semibold text-foreground dark:text-d-text">
                    {t(tier.streak)}
                  </Text>
                  <Text className="text-sm text-muted-foreground dark:text-d-muted">
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

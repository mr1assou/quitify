import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { AttemptStatsRow } from "@/types/stats/userStats";
import {
  attemptOutcomeLabel,
  buildAttemptDetailRows,
} from "@/utils/stats/attemptPresentation";

type Props = {
  attempt: AttemptStatsRow | null;
  currency: string;
  timeZone: string;
  onClose: () => void;
};

export function AttemptDetailModal({ attempt, currency, timeZone, onClose }: Props) {
  const { t, locale } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    onClose();
  };

  const detailRows = attempt
    ? buildAttemptDetailRows(attempt, currency, timeZone, t, locale)
    : [];

  return (
    <Modal
      visible={attempt !== null}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={handleClose} />

        <View
          className="max-h-[85%] rounded-t-3xl bg-background px-6 pt-5 dark:bg-d-bg"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          {attempt ? (
            <>
              <View className="mb-4 items-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                  <Ionicons name="medal" size={26} color={colors.white} />
                </View>
                <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {t("stats.attemptNumber", { n: attempt.attemptNumber })}
                </Text>
                <View
                  className={`mt-2 rounded-full px-3 py-1 ${
                    attempt.isActive ? "bg-accent/20" : "bg-section dark:bg-d-surface"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold uppercase tracking-wider ${
                      attempt.isActive ? "text-accent" : "text-muted-foreground dark:text-d-muted"
                    }`}
                  >
                    {attemptOutcomeLabel(attempt, t)}
                  </Text>
                </View>
              </View>

              <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                <View className="gap-2">
                  {detailRows.map((row) => (
                    <DetailRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </View>
              </ScrollView>

              <View className="mt-5">
                <Button label={t("common.close")} onPress={handleClose} fullWidth />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
      <Text className="mr-4 flex-1 text-sm text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <Text className="max-w-[58%] text-right text-sm font-semibold text-foreground dark:text-d-text">
        {value}
      </Text>
    </View>
  );
}

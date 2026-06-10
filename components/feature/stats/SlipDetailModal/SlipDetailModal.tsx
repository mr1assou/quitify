import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import type { SlipStatsRow } from "@/types/userStats";
import { buildSlipDetailRows, slipOutcomeLabel } from "@/utils/stats/slipPresentation";
import { formatUtcDateInTimezone } from "@/utils/time/formatInTimezone";

type Props = {
  slip: SlipStatsRow | null;
  timeZone: string;
  onClose: () => void;
};

export function SlipDetailModal({ slip, timeZone, onClose }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    Haptics.selectionAsync().catch(() => {});
    onClose();
  };

  const detailRows = slip ? buildSlipDetailRows(slip, timeZone) : [];

  return (
    <Modal
      visible={slip !== null}
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
          {slip ? (
            <>
              <View className="mb-4 items-center">
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-alert">
                  <Ionicons name="flame" size={26} color={colors.white} />
                </View>
                <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
                  {slipOutcomeLabel(slip.outcome)}
                </Text>
                <Text className="mt-1 text-center text-sm text-muted-foreground dark:text-d-muted">
                  {formatUtcDateInTimezone(slip.loggedAt, timeZone)}
                </Text>
              </View>

              <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
                <View className="gap-2">
                  {detailRows.map((row) => (
                    <DetailRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </View>
              </ScrollView>

              <View className="mt-5">
                <Button label="Close" onPress={handleClose} fullWidth />
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
      <Text className="mr-4 flex-1 text-sm text-muted-foreground dark:text-d-muted">{label}</Text>
      <Text className="max-w-[58%] text-right text-sm font-semibold text-foreground dark:text-d-text">
        {value}
      </Text>
    </View>
  );
}

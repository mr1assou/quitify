import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LapseConfirmModal({ visible, onClose, onConfirm }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          className="absolute inset-0 bg-black/50"
          onPress={handleClose}
        />

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background px-6 py-7 dark:bg-d-bg">
          <View className="items-center">
            <View
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}22` }}
            >
              <Ionicons name="checkmark-circle-outline" size={30} color={colors.primary} />
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
              {t("craving.slipLapseConfirmTitle")}
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
              {t("craving.slipLapseConfirmBody")}
            </Text>
          </View>

          <View className="mt-6 gap-3">
            <Button
              label={t("craving.slipLapseConfirmCta")}
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleConfirm}
            />
            <Pressable
              accessibilityRole="button"
              onPress={handleClose}
              className="items-center py-2 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                {t("common.cancel")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

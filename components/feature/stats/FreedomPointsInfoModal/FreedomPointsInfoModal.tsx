import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function FreedomPointsInfoModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

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
              <Ionicons name="flash-outline" size={30} color={colors.primary} />
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-foreground dark:text-d-text">
              {t("stats.freedomPointsInfoTitle")}
            </Text>
          </View>

          <Text className="mt-4 text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {t("stats.freedomPointsInfoMessage")}
          </Text>

          <View className="mt-5">
            <Button label={t("common.gotIt")} onPress={handleClose} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

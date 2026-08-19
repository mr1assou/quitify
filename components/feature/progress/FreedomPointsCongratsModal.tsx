import { Image } from "expo-image";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { GREETING_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { formatNumber } from "@/utils/shared/format";

type Props = {
  visible: boolean;
  /** FP granted since the last congrats (already summed — one popup per sync). */
  amount: number;
  onClose: () => void;
};

export function FreedomPointsCongratsModal({ visible, amount, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-black/55"
          onPress={onClose}
          accessibilityLabel={t("common.close")}
        />

        <View className="w-full max-w-sm overflow-hidden rounded-3xl bg-background dark:bg-d-bg">
          <View className="items-center px-6 pb-2 pt-6">
            <Image
              source={GREETING_IMAGE}
              style={{ width: 180, height: 180 }}
              contentFit="contain"
              accessibilityLabel={t("stats.fpCongratsTitle")}
            />
          </View>

          <View className="px-6 pb-5">
            <Text className="mb-2 text-center text-xl font-bold text-foreground dark:text-d-text">
              {t("stats.fpCongratsTitle")}
            </Text>
            <Text className="text-center text-2xl font-extrabold tabular-nums text-primary">
              {t("stats.fpAmount", { amount: formatNumber(amount) })}
            </Text>
            <Text className="mt-2 text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
              {t("stats.fpCongratsBody", { amount: formatNumber(amount) })}
            </Text>
          </View>

          <View className="px-6 pb-6">
            <Button label={t("common.gotIt")} onPress={onClose} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

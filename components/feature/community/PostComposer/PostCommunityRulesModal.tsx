import { Image } from "expo-image";
import { Modal, Pressable, Text, View } from "react-native";

import { COMMUNITY_ALERT_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PostCommunityRulesModal({ visible, onClose }: Props) {
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
              source={COMMUNITY_ALERT_IMAGE}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
              accessibilityLabel={t("community.rulesImageA11y")}
            />
          </View>

          <View className="px-6 pb-4">
            <Text className="mb-2 text-center text-lg font-bold text-foreground dark:text-d-text">
              {t("community.rulesTitle")}
            </Text>
            <Text className="text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
              {t("community.rulesBody")}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="mx-6 mb-6 items-center rounded-full bg-primary py-3 active:opacity-80"
            accessibilityLabel={t("community.rulesCloseA11y")}
          >
            <Text className="text-base font-bold text-white">{t("common.gotIt")}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

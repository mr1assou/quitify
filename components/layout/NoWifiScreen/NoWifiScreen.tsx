import { Image } from "expo-image";
import { Text, View, useWindowDimensions } from "react-native";

import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { NO_WIFI_IMAGE } from "@/constants/app/assets";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const IMAGE_MAX_SIZE = 300;

export function NoWifiScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width - 64, IMAGE_MAX_SIZE);

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={NO_WIFI_IMAGE}
          style={{ width: imageSize, height: imageSize }}
          contentFit="contain"
          accessibilityLabel={t("layout.offlineTitle")}
        />
        <Text className="mt-6 text-center text-lg font-semibold text-foreground dark:text-d-text">
          {t("layout.offlineTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          {t("layout.offlineMessage")}
        </Text>
      </View>
    </ScreenCanvas>
  );
}

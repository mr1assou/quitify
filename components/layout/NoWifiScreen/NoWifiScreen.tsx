import { Image } from "expo-image";
import { Text, View, useWindowDimensions } from "react-native";

import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { NO_WIFI_IMAGE } from "@/constants/app/assets";

const IMAGE_MAX_SIZE = 300;

export function NoWifiScreen() {
  const { width } = useWindowDimensions();
  const imageSize = Math.min(width - 64, IMAGE_MAX_SIZE);

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={NO_WIFI_IMAGE}
          style={{ width: imageSize, height: imageSize }}
          contentFit="contain"
          accessibilityLabel="No internet connection"
        />
        <Text className="mt-6 text-center text-lg font-semibold text-foreground dark:text-d-text">
          Internet required
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
          Connect to the internet to use Quitify.
        </Text>
      </View>
    </ScreenCanvas>
  );
}

import { Image, Text, View } from "react-native";

import { APP_LOGO_IMAGE } from "@/constants/assets";

export function AppBrandMark() {
  return (
    <View className="-ml-2 flex-row items-center">
      <Image
        source={APP_LOGO_IMAGE}
        className="h-14 w-14"
        resizeMode="contain"
        accessibilityLabel="Quitify app logo"
      />
      <Text className="text-2xl font-bold text-foreground dark:text-d-text">Quitify</Text>
    </View>
  );
}

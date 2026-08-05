import { Image, Text, View } from "react-native";

import { APP_LOGO_IMAGE } from "@/constants/app/assets";

export function AppBrandMark() {
  return (
    <View className="-ml-2 flex-row items-center gap-1.5">
      <Image
        source={APP_LOGO_IMAGE}
        className="h-12 w-12"
        resizeMode="contain"
        accessibilityLabel="Quitify app logo"
      />
      <Text className="text-xl font-bold text-foreground dark:text-d-text">Quitify</Text>
    </View>
  );
}

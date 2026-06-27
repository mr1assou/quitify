import { Image, useColorScheme, View } from "react-native";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { AppScreenBackground } from "@/components/layout/AppScreenBackground";
import { APP_SPLASH_IMAGE, APP_SPLASH_LOGO_SIZE } from "@/constants/app/assets";

/** Gradient + logo while theme preference hydrates (replaces a blank frame). */
export function BootstrapSplash() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <View className="flex-1">
      <AppScreenBackground isDark={isDark} showOrbs={false} />
      <View className="flex-1 items-center justify-center">
        <Image
          source={APP_SPLASH_IMAGE}
          accessibilityLabel="Quitify"
          style={{ width: APP_SPLASH_LOGO_SIZE, height: APP_SPLASH_LOGO_SIZE }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

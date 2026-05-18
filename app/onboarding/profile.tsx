import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IntroPagerGradient } from "@/components/feature/intro/IntroPagerGradient";
import { Button } from "@/components/ui/Button";
import { introHeroImageHeight } from "@/constants/intro";
import { useApp } from "@/context/AppContext";
import { buildProfile, useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";

const CELEBRATION_TITLE = "Your smoke-free story starts here";
const CELEBRATION_CAPTION = "Quitify is here for you 24/7";

export default function OnboardingProfile() {
  const { colors, resolved } = useTheme();
  const { draft } = useOnboarding();
  const { completeOnboarding } = useApp();
  const { height: winH } = useWindowDimensions();
  const [pageW, setPageW] = useState(0);
  const [pageH, setPageH] = useState(0);
  const imageHeight = Math.min(Math.round(introHeroImageHeight(winH) * 1.08), 510);

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      <View
        className="flex-1"
        onLayout={(e) => {
          const w = Math.round(e.nativeEvent.layout.width);
          const h = Math.round(e.nativeEvent.layout.height);
          if (w > 0 && w !== pageW) setPageW(w);
          if (h > 0 && h !== pageH) setPageH(h);
        }}
      >
        {pageW > 0 && pageH > 0 ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <IntroPagerGradient
              gradientIdSuffix="onboarding-celebration"
              width={pageW}
              height={pageH}
              colors={colors}
              isDark={resolved === "dark"}
            />
          </View>
        ) : null}

        <View className="z-10 flex-1 px-6">
          <View className="pt-2">
            <Pressable
              onPress={() => router.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section/60 dark:active:bg-d-surface/80"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <View className="min-h-0 flex-1 justify-center pb-4">
            <View className="items-stretch px-1">
              <Text className="text-center text-3xl font-bold leading-9 text-foreground dark:text-d-text">
                {CELEBRATION_TITLE}
              </Text>
              <Image
                source={require("../../assets/images/yes.png")}
                style={{ width: "100%", height: imageHeight, marginTop: 24 }}
                resizeMode="contain"
                accessibilityLabel="Celebration illustration"
              />
              <Text className="mt-6 text-center text-2xl font-bold leading-8 text-black dark:text-white">
                {CELEBRATION_CAPTION}
              </Text>
            </View>
          </View>

          <View className="pb-4">
            <Button
              label="Start my journey"
              size="lg"
              fullWidth
              onPress={() => {
                completeOnboarding(buildProfile(draft));
                router.replace("/(tabs)");
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

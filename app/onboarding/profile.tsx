import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { safeRouter } from "@/utils/safeRouter";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { IntroPagerGradient } from "@/components/feature/intro/IntroPagerGradient";
import { OnboardingSocialAuth } from "@/components/feature/onboarding/OnboardingSocialAuth";
import { introHeroImageHeight } from "@/constants/intro";
import { useApp } from "@/context/AppContext";
import { buildProfile, useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";

const CELEBRATION_TITLE = "Your smoke-free story starts here";

export default function OnboardingProfile() {
  const { colors, resolved } = useTheme();
  const insets = useSafeAreaInsets();
  const { draft } = useOnboarding();
  const { completeOnboarding, setAccount } = useApp();
  const [busy, setBusy] = useState(false);
  const { height: winH } = useWindowDimensions();
  const [pageW, setPageW] = useState(0);
  const [pageH, setPageH] = useState(0);
  const imageHeight = Math.min(Math.round(introHeroImageHeight(winH) * 1.08), 510);
  const bottomPad = insets.bottom + 40;

  const continueWithGoogle = useCallback(() => {
    if (busy) return;
    setBusy(true);
    const name = draft.username.trim();
    setAccount({
      name: name.length > 0 ? name : undefined,
      email: `google-${Date.now()}@quitify.app`,
      createdAt: Date.now(),
    });
    completeOnboarding(buildProfile(draft));
    safeRouter.replace("/(tabs)");
  }, [busy, completeOnboarding, draft, setAccount]);

  const continueWithEmail = useCallback(() => {
    safeRouter.push({ pathname: "/signup", params: { fromCelebration: "1" } });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBusy(false);
    }, []),
  );

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
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

        <View
          className="z-10 min-h-0 flex-1 px-6"
          style={{ paddingBottom: bottomPad }}
        >
          {/* Back — fixed header */}
          <View className="shrink-0 justify-center" style={{ height: 48 }}>
            <Pressable
              onPress={() => safeRouter.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section/60 dark:active:bg-d-surface/80"
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Hero — title + image */}
          <View className="min-h-0 flex-1 justify-center px-1" style={{ marginTop: 20 }}>
            <Text className="text-center text-3xl font-bold leading-9 text-foreground dark:text-d-text">
              {CELEBRATION_TITLE}
            </Text>
            <Image
              source={require("../../assets/images/yes.png")}
              style={{ width: "100%", height: imageHeight, marginTop: 24 }}
              resizeMode="contain"
              accessibilityLabel="Celebration illustration"
            />
          </View>

          {/* Sign-in — above home indicator */}
          <View className="shrink-0 pt-6">
            <OnboardingSocialAuth
              onGoogle={continueWithGoogle}
              onEmail={continueWithEmail}
              disabled={busy}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

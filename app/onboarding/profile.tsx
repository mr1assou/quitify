import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { IntroPagerGradient } from "@/components/feature/intro/IntroPagerGradient";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { OnboardingSocialAuth } from "@/components/feature/onboarding/OnboardingSocialAuth";
import { introHeroImageHeight } from "@/constants/app/intro";
import { useApp } from "@/context/AppContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { useGoogleSignIn } from "@/hooks/auth/useGoogleSignIn";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { finalizeGoogleAuth } from "@/services/auth/finalizeGoogleAuth";
import { finalizeGoogleLogin } from "@/services/auth/finalizeGoogleLogin";
import {
  GoogleAccountAlreadyExistsError,
  GoogleAccountNotFoundError,
} from "@/services/auth/googleNativeAuthApi";
import { logSignupView } from "@/services/analytics/firebaseEvents";


export default function OnboardingProfile() {
  const { t } = useTranslation();
  const { colors, resolved } = useTheme();
  const insets = useSafeAreaInsets();
  const { draft } = useOnboarding();
  const { completeOnboarding, setAccount } = useApp();
  const { googleError, flow } = useLocalSearchParams<{
    googleError?: string;
    flow?: string;
  }>();
  const isLoginFlow = flow === "login";
  const { signInWithGoogle, isReady } = useGoogleSignIn();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { height: winH } = useWindowDimensions();
  const [pageW, setPageW] = useState(0);
  const [pageH, setPageH] = useState(0);
  const imageHeight = Math.min(Math.round(introHeroImageHeight(winH) * 1.08), 510);
  const bottomPad = insets.bottom + 40;

  useEffect(() => {
    if (!isLoginFlow) logSignupView();
  }, [isLoginFlow]);

  const continueWithGoogle = useCallback(async () => {
    if (busy || !isReady) return;
    setBusy(true);
    setError(null);
    try {
      const auth = await signInWithGoogle({
        loginOnly: isLoginFlow,
        signupOnly: !isLoginFlow,
      });

      if (isLoginFlow) {
        const session = await finalizeGoogleLogin(auth, {
          setAccount,
          completeOnboarding,
        });
        if (!session.isOnboarded) {
          safeRouter.replace("/onboarding/reasons");
          return;
        }
      } else {
        await finalizeGoogleAuth(auth, draft, { setAccount, completeOnboarding });
      }

      safeRouter.replace("/(tabs)");
    } catch (e) {
      if (isLoginFlow && e instanceof GoogleAccountNotFoundError) {
        setError(t("auth.emailNotFound"));
        setBusy(false);
        return;
      }
      if (!isLoginFlow && e instanceof GoogleAccountAlreadyExistsError) {
        setError(t("auth.emailExists"));
        setBusy(false);
        return;
      }
      setError(e instanceof Error ? e.message : t("auth.googleFailed"));
      setBusy(false);
    }
  }, [
    busy,
    isReady,
    isLoginFlow,
    signInWithGoogle,
    draft,
    setAccount,
    completeOnboarding,
    t,
  ]);

  const continueWithEmail = useCallback(() => {
    if (isLoginFlow) {
      safeRouter.push("/login-email");
      return;
    }
    safeRouter.push({ pathname: "/signup", params: { fromCelebration: "1" } });
  }, [isLoginFlow]);

  useFocusEffect(
    useCallback(() => {
      setBusy(false);
      if (googleError) {
        setError(String(googleError));
      } else {
        setError(null);
      }
    }, [googleError]),
  );

  if (busy) {
    return <ThemedLoadingScreen />;
  }

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
          <View className="shrink-0 justify-center" style={{ height: 48 }}>
            <Pressable
              onPress={() => safeRouter.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section/60 dark:active:bg-d-surface/80"
              accessibilityRole="button"
              accessibilityLabel={t("common.back")}
            >
              <Ionicons name="chevron-back" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <View className="min-h-0 flex-1 justify-center px-1" style={{ marginTop: 20 }}>
            <Text className="text-center text-3xl font-bold leading-9 text-foreground dark:text-d-text">
              {isLoginFlow ? t("onboarding.celebration.loginTitle") : t("onboarding.celebration.signupTitle")}
            </Text>
            <Image
              source={require("../../assets/images/yes.webp")}
              style={{ width: "100%", height: imageHeight, marginTop: 24 }}
              resizeMode="contain"
              accessibilityLabel="Celebration illustration"
            />
          </View>

          <View className="shrink-0 pt-6">
            {error ? (
              <Text className="mb-3 text-center text-sm text-alert">{error}</Text>
            ) : null}
            <OnboardingSocialAuth
              onGoogle={continueWithGoogle}
              onEmail={continueWithEmail}
              googleDisabled={busy || !isReady}
              emailDisabled={busy}
              googleLabel={
                isLoginFlow
                  ? t("onboarding.celebration.signInGoogle")
                  : t("onboarding.celebration.signUpGoogle")
              }
              emailLabel={
                isLoginFlow ? t("auth.loginTitle") : t("onboarding.celebration.continueEmail")
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

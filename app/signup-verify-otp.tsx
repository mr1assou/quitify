import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { finalizeEmailSignup } from "@/services/auth/finalizeEmailSignup";
import {
  isEmailAlreadyExistsError,
  sendEmailSignupOtp,
  verifyEmailSignupOtp,
} from "@/services/auth/emailSignupOtpApi";
import { safeRouter } from "@/utils/app/safeRouter";

export default function SignupVerifyOtpScreen() {
  const { email, fromCelebration } = useLocalSearchParams<{
    email?: string;
    fromCelebration?: string;
  }>();
  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  const fromCelebrationScreen = fromCelebration === "1";

  const { completeOnboarding, setAccount, setFlag } = useApp();
  const { draft } = useOnboarding();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const canSubmit = /^\d{6}$/.test(code);

  const verify = async () => {
    if (!normalizedEmail || !canSubmit || busy) return;

    setBusy(true);
    setError(null);
    try {
      const auth = await verifyEmailSignupOtp(normalizedEmail, code);

      if (fromCelebrationScreen) {
        await finalizeEmailSignup(auth, draft, { setAccount, completeOnboarding });
        setFlag("hasSeenSignupPrompt", true);
        safeRouter.replace("/(tabs)");
        return;
      }

      setFlag("hasSeenSignupPrompt", true);
      safeRouter.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("auth.verifyFailed"));
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!normalizedEmail || resending || busy) return;

    setResending(true);
    setError(null);
    try {
      await sendEmailSignupOtp(normalizedEmail);
    } catch (e) {
      if (isEmailAlreadyExistsError(e)) {
        setError(t("auth.emailExists"));
      } else {
        setError(e instanceof Error ? e.message : t("auth.sendCodeFailed"));
      }
    } finally {
      setResending(false);
    }
  };

  if (!normalizedEmail) {
    return (
      <ScreenCanvas edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            {t("common.missingEmail")}
          </Text>
          <Pressable onPress={() => router.back()} className="mt-4 active:opacity-70">
            <Text className="font-semibold text-primary">{t("common.goBack")}</Text>
          </Pressable>
        </View>
      </ScreenCanvas>
    );
  }

  if (busy) {
    return <ThemedLoadingScreen />;
  }

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <Text className="text-center text-3xl font-bold text-foreground dark:text-d-text">
            {t("auth.otpTitle")}
          </Text>
          <Text className="mt-3 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
            {t("auth.otpSubtitle", { email: normalizedEmail })}
          </Text>

          {error ? (
            <Text className="mt-4 text-center text-sm text-alert">{error}</Text>
          ) : null}

          <View className="mt-10">
            <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
              {t("auth.otpLabel")}
            </Text>
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={6}
              className="mt-1 rounded-2xl bg-section px-4 py-4 text-center text-2xl font-bold tracking-[0.35em] text-foreground dark:bg-d-surface dark:text-d-text"
            />
          </View>

          <View className="mt-10">
            <Button
              label={t("auth.verifyCta")}
              size="lg"
              fullWidth
              disabled={!canSubmit}
              onPress={() => void verify()}
            />
          </View>

          <Pressable
            onPress={() => void resend()}
            disabled={resending}
            className="mt-4 items-center py-2 active:opacity-70"
          >
            <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
              {resending ? t("common.sending") : t("auth.resendCode")}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenCanvas>
  );
}

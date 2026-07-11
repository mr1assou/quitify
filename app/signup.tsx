import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import {
  isEmailAlreadyExistsError,
  sendEmailSignupOtp,
} from "@/services/auth/emailSignupOtpApi";
import { safeRouter } from "@/utils/app/safeRouter";

export default function Signup() {
  const { fromCelebration } = useLocalSearchParams<{ fromCelebration?: string }>();
  const fromCelebrationScreen = fromCelebration === "1";
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = email.includes("@") && email.includes(".");

  const submit = async () => {
    if (!valid || busy) return;

    setBusy(true);
    setError(null);
    try {
      await sendEmailSignupOtp(email);
      Keyboard.dismiss();
      safeRouter.pushStack({
        pathname: "/signup-verify-otp",
        params: {
          email: email.trim().toLowerCase(),
          ...(fromCelebrationScreen ? { fromCelebration: "1" } : {}),
        },
      });
    } catch (e) {
      setBusy(false);
      if (isEmailAlreadyExistsError(e)) {
        setError(t("auth.emailExists"));
      } else {
        setError(e instanceof Error ? e.message : t("auth.sendCodeFailed"));
      }
    }
  };

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center justify-end px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <Text className="text-center text-3xl font-bold text-foreground dark:text-d-text">
            {t("auth.signupTitle")}
          </Text>
          <Text className="mt-3 text-center text-sm text-muted-foreground dark:text-d-muted">
            {t("auth.signupSubtitle")}
          </Text>

          {error ? (
            <Text className="mt-4 text-center text-sm text-alert">{error}</Text>
          ) : null}

          <View className="mt-10 gap-3">
            <Field
              label={t("auth.emailLabel")}
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.emailPlaceholder")}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!busy}
              colors={colors}
            />
          </View>

          <View className="mt-10">
            <Button
              label={t("common.continue")}
              size="lg"
              fullWidth
              loading={busy}
              disabled={!valid || busy}
              onPress={() => void submit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenCanvas>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize = "sentences",
  keyboardType,
  editable = true,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  editable?: boolean;
  colors: { mutedForeground: string };
}) {
  return (
    <View className="gap-1">
      <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        editable={editable}
        className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
      />
    </View>
  );
}

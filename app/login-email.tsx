import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import {
  isEmailNotFoundError,
  sendEmailLoginOtp,
} from "@/services/auth/emailSignupOtpApi";
import { safeRouter } from "@/utils/app/safeRouter";

const LOGIN_EMAIL_NOT_FOUND =
  "Your email doesn't exist. Tap Get started on the welcome screen to create an account.";

export default function LoginEmailScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes("@") && email.includes(".");

  const submit = async () => {
    if (!canSubmit || busy) return;

    setBusy(true);
    setError(null);
    try {
      await sendEmailLoginOtp(email);
      Keyboard.dismiss();
      safeRouter.pushStack({
        pathname: "/login-verify-otp",
        params: { email: email.trim().toLowerCase() },
      });
    } catch (e) {
      setBusy(false);
      if (isEmailNotFoundError(e)) {
        setError(LOGIN_EMAIL_NOT_FOUND);
      } else {
        setError(e instanceof Error ? e.message : "Could not send verification code");
      }
    }
  };

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            disabled={busy}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <Text className="text-center text-3xl font-bold text-foreground dark:text-d-text">
            Sign in with email
          </Text>
          <Text className="mt-3 text-center text-sm text-muted-foreground dark:text-d-muted">
            We&apos;ll send a verification code to your inbox.
          </Text>

          {error ? (
            <Text className="mt-4 text-center text-sm text-alert">{error}</Text>
          ) : null}

          <View className="mt-10 gap-3">
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!busy}
              colors={colors}
            />
          </View>

          <View className="mt-10">
            <Button
              label="Continue"
              size="lg"
              fullWidth
              loading={busy}
              disabled={!canSubmit || busy}
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

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { loginWithEmail } from "@/services/auth/emailLoginApi";
import { finalizeGoogleLogin } from "@/services/auth/finalizeGoogleLogin";
import { safeRouter } from "@/utils/app/safeRouter";

export default function LoginEmailScreen() {
  const { colors } = useTheme();
  const { setAccount, completeOnboarding } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes("@") && password.trim().length > 0;

  const submit = async () => {
    if (!canSubmit || busy) return;

    setBusy(true);
    setError(null);
    try {
      const tokens = await loginWithEmail(email, password);
      const session = await finalizeGoogleLogin(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isNewUser: false,
          email: email.trim().toLowerCase(),
        },
        { setAccount, completeOnboarding },
      );

      if (!session.isOnboarded) {
        safeRouter.replace("/onboarding/reasons");
        return;
      }

      safeRouter.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
      setBusy(false);
    }
  };

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

          {error ? (
            <Text className="mt-4 text-center text-sm text-alert">{error}</Text>
          ) : null}

          <Animated.View entering={FadeInUp.delay(120).duration(450)} className="mt-10 gap-3">
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              colors={colors}
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              colors={colors}
            />
          </Animated.View>

          <View className="mt-10">
            <Button
              label="Sign in"
              size="lg"
              fullWidth
              disabled={!canSubmit}
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
  secureTextEntry,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  secureTextEntry?: boolean;
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
        secureTextEntry={secureTextEntry}
        className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
      />
    </View>
  );
}

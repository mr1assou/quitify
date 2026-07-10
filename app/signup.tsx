import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useState } from "react";
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

import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { buildProfile, useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { markPostSignupFlowPending } from "@/utils/onboarding/postSignupFlowStorage";

export default function Signup() {
  const { fromCelebration } = useLocalSearchParams<{ fromCelebration?: string }>();
  const fromCelebrationScreen = fromCelebration === "1";
  const { state, completeOnboarding, setAccount, setFlag } = useApp();
  const { draft } = useOnboarding();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const valid = email.includes("@") && email.includes(".");

  const enterAppFromCelebration = useCallback(() => {
    completeOnboarding(buildProfile(draft));
    safeRouter.replace("/(tabs)");
  }, [completeOnboarding, draft]);

  const submit = () => {
    if (!valid) return;
    setAccount({
      name: name.trim() || undefined,
      email: email.trim().toLowerCase(),
      createdAt: Date.now(),
    });
    setFlag("hasSeenSignupPrompt", true);
    if (fromCelebrationScreen) {
      void markPostSignupFlowPending().then(() => enterAppFromCelebration());
    } else if (state.isOnboarded) safeRouter.replace("/(tabs)");
    else router.back();
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
            Sign up with email
          </Text>

          <Animated.View entering={FadeInUp.delay(120).duration(450)} className="mt-10 gap-3">
            <Field
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Optional"
              autoCapitalize="words"
              colors={colors}
            />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              colors={colors}
            />
          </Animated.View>

          <View className="mt-10">
            <Button
              label="Sign up"
              size="lg"
              fullWidth
              disabled={!valid}
              onPress={submit}
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
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
  colors: { mutedForeground: string; foreground: string };
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
        className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
      />
    </View>
  );
}

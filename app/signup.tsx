import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeRouter } from "@/utils/safeRouter";
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
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { buildProfile, useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";

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
    if (fromCelebrationScreen) enterAppFromCelebration();
    else if (state.isOnboarded) safeRouter.replace("/(tabs)");
    else router.back();
  };

  const skip = () => {
    setFlag("hasSeenSignupPrompt", true);
    if (fromCelebrationScreen) enterAppFromCelebration();
    else if (state.isOnboarded) safeRouter.replace("/(tabs)");
    else router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
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
          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Ionicons name="cloud-upload" size={28} color={colors.white} />
            </View>
            <Text className="mt-4 text-center text-3xl font-bold text-foreground dark:text-d-text">
              Save your progress
            </Text>
            <Text className="mt-2 px-2 text-center text-sm text-muted-foreground dark:text-d-muted">
              Don&apos;t lose your streak if you switch phones. Free, no spam.
            </Text>
          </Animated.View>

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

          <View className="mt-10 gap-3">
            <Button
              label="Sign up"
              size="lg"
              fullWidth
              disabled={!valid}
              onPress={submit}
            />
            <Pressable onPress={skip} className="items-center py-3 active:opacity-70">
              <Text className="text-sm font-semibold text-muted-foreground dark:text-d-muted">
                Continue without account
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

import { safeRouter } from "@/utils/safeRouter";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeToggleButton } from "@/components/layout/ThemeToggleButton";
import { Button } from "@/components/ui/Button";

const SUBTITLE =
  "Begin your Quitify journey to a smoke-free life and reclaim your time and health";

const TERMS_INTRO =
  "By continuing you agree to how Quitify works and how we handle your data. You can read the full legal wording anytime.";

export function WelcomeScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <View className="flex-row items-center justify-end px-6 pt-3">
        <ThemeToggleButton />
      </View>

      <View className="flex-1 justify-between px-6 pb-8 pt-2">
        <View className="flex-1 items-center justify-center">
          <Animated.View
            entering={FadeIn.duration(700)}
            className="h-44 w-44 items-center justify-center rounded-3xl bg-section p-3 dark:bg-d-surface"
          >
            <Image
              source={require("../../../../assets/images/logo.png")}
              className="h-full w-full"
              resizeMode="contain"
              accessibilityLabel="Quitify app logo"
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(150).duration(500)}
            className="mt-10 text-center text-4xl font-bold text-foreground dark:text-d-text"
          >
            Begin your healthy journey
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(280).duration(500)}
            className="mt-3 px-2 text-center text-base text-muted-foreground dark:text-d-muted"
          >
            {SUBTITLE}
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} className="gap-3">
          <Button
            label="Let's get started"
            size="lg"
            fullWidth
            onPress={() => safeRouter.push("/intro")}
          />
          <Pressable
            onPress={() => safeRouter.push("/onboarding/profile")}
            className="items-center py-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="I already have an account"
          >
            <Text className="text-base font-semibold text-foreground dark:text-d-text">
              I already have an account
            </Text>
          </Pressable>

          <View className="mt-1 items-center gap-2 px-1">
            <Text className="text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
              {TERMS_INTRO}
            </Text>
            <Pressable
              onPress={() => safeRouter.push("/terms")}
              className="items-center py-1 active:opacity-70"
            >
              <Text className="text-base font-semibold text-foreground underline dark:text-d-text">
                Terms and conditions
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

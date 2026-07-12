import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { ThemeToggleButton } from "@/components/layout/ThemeToggleButton";
import { Button } from "@/components/ui/Button";
import { WEBSITE_TERMS_URL } from "@/constants/app/website";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { openExternalUrl } from "@/utils/app/openExternalUrl";
import { safeRouter } from "@/utils/app/safeRouter";

export function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <View className="flex-row items-center justify-end gap-2 px-6 pt-3">
        <ThemeToggleButton />
      </View>

      <View className="flex-1 justify-between px-6 pb-8 pt-2">
        <View className="flex-1 items-center justify-center">
          <Animated.View
            entering={FadeIn.duration(700)}
            className="h-44 w-44 items-center justify-center rounded-3xl border border-border/60 bg-section p-3 dark:border-d-border dark:bg-d-surface/95"
          >
            <Image
              source={require("../../../../assets/images/logo.webp")}
              className="h-full w-full"
              resizeMode="contain"
              accessibilityLabel={t("welcome.logoA11y")}
            />
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(150).duration(500)}
            className="mt-10 text-center text-4xl font-bold text-foreground dark:text-d-text"
          >
            {t("welcome.title")}
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(280).duration(500)}
            className="mt-3 px-2 text-center text-base text-muted-foreground dark:text-d-muted"
          >
            {t("welcome.subtitle")}
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} className="gap-3">
          <Button
            label={t("welcome.getStarted")}
            size="lg"
            fullWidth
            onPress={() => safeRouter.push("/intro")}
          />
          <Pressable
            onPress={() =>
              safeRouter.push({
                pathname: "/onboarding/profile",
                params: { flow: "login" },
              })
            }
            className="items-center py-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={t("welcome.haveAccount")}
          >
            <Text className="text-base font-semibold text-foreground dark:text-d-text">
              {t("welcome.haveAccount")}
            </Text>
          </Pressable>

          <View className="mt-1 items-center gap-2 px-1">
            <Text className="text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
              {t("welcome.termsIntro")}
            </Text>
            <Pressable
              onPress={() => openExternalUrl(WEBSITE_TERMS_URL)}
              className="items-center py-1 active:opacity-70"
            >
              <Text className="text-base font-semibold text-foreground underline dark:text-d-text">
                {t("welcome.termsLink")}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </ScreenCanvas>
  );
}

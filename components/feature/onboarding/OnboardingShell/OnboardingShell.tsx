import { Ionicons } from "@expo/vector-icons";
import { safeRouter } from "@/utils/app/safeRouter";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { ScreenCanvas } from "@/components/layout/ScreenCanvas";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  showBack?: boolean;
  scrollBody?: boolean;
};

export function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  children,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  showBack = true,
  scrollBody = false,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScreenCanvas edges={["top", "bottom"]}>
      <View className="min-h-0 flex-1 px-6 pt-2">
        <View className="flex-row items-center justify-between">
          {showBack ? (
            <Pressable
              onPress={() => safeRouter.back()}
              className="-ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-section dark:active:bg-d-surface"
            >
              <Ionicons name="chevron-back" size={22} color={colors.foreground} />
            </Pressable>
          ) : (
            <View className="h-10 w-10" />
          )}
          <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
            Step {step} of {total}
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/60 dark:bg-d-surface/80">
          <Animated.View
            entering={FadeIn.duration(300)}
            className="h-full rounded-full bg-primary"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </View>

        <Animated.View entering={FadeInUp.duration(450).springify().damping(18)} className="mt-8">
          <Text className="text-3xl font-bold text-foreground dark:text-d-text">{title}</Text>
          {subtitle ? (
            <Text className="mt-2 text-base text-muted-foreground dark:text-d-muted">{subtitle}</Text>
          ) : null}
        </Animated.View>

        <View
          className={
            scrollBody
              ? "min-h-0 flex-1 justify-start pt-4"
              : "flex-1 justify-center"
          }
        >
          {children}
        </View>

        <View className="pb-4">
          <Button
            label={primaryLabel}
            onPress={onPrimary}
            size="lg"
            fullWidth
            disabled={primaryDisabled}
          />
        </View>
      </View>
    </ScreenCanvas>
  );
}

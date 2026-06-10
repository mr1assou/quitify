import { Redirect, Stack } from "expo-router";

import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";

export default function OnboardingLayout() {
  const { colors } = useTheme();
  const { state, isHydrated } = useApp();

  if (!isHydrated) {
    return <ThemedLoadingScreen />;
  }

  if (state.isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

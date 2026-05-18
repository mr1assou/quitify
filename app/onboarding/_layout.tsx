import { Stack } from "expo-router";

import { OnboardingProvider } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";

function ThemedOnboardingStack() {
  const { colors } = useTheme();
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

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <ThemedOnboardingStack />
    </OnboardingProvider>
  );
}

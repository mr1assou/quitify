import { Redirect } from "expo-router";

import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { useApp } from "@/context/AppContext";

export default function Index() {
  const { state, isHydrated } = useApp();

  if (!isHydrated) {
    return <ThemedLoadingScreen />;
  }

  if (state.isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding" />;
}

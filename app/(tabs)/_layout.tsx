import { Redirect, Tabs } from "expo-router";

import { TabBar } from "@/components/layout/TabBar";
import { ThemedLoadingScreen } from "@/components/ui/ThemedLoadingScreen";
import { WELCOME_ROUTE } from "@/constants/app/routes";
import { useApp } from "@/context/AppContext";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { state, isHydrated } = useApp();

  if (!isHydrated) {
    return <ThemedLoadingScreen />;
  }

  if (!state.isOnboarded) {
    return <Redirect href={WELCOME_ROUTE} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
      <Tabs.Screen name="community" options={{ title: t("tabs.community") }} />
      <Tabs.Screen name="missions" options={{ title: t("tabs.missions") }} />
      <Tabs.Screen name="stats" options={{ title: t("tabs.stats") }} />
      <Tabs.Screen name="rewards" options={{ title: t("tabs.achievements") }} />
    </Tabs>
  );
}

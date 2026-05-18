import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { CravingStrongHero } from "@/components/feature/craving/CravingStrongHero";
import { CravingToolsGrid } from "@/components/feature/craving/CravingToolsGrid";

export function CravingSessionFlow() {
  const close = useCallback(() => router.back(), []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader onClose={close} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-6 pt-4">
          <CravingStrongHero />
        </View>

        <View className="mt-6 px-6">
          <CravingToolsGrid />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

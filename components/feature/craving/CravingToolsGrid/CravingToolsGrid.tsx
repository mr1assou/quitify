import { router } from "expo-router";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CravingToolCard } from "@/components/feature/craving/CravingToolCard";
import { CRAVING_TOOLS } from "@/constants/cravingTools";
import { useTheme } from "@/context/ThemeContext";

export function CravingToolsGrid() {
  const { resolved } = useTheme();
  const isDark = resolved === "dark";

  return (
    <Animated.View entering={FadeInUp.delay(180).duration(450)}>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {CRAVING_TOOLS.map((tool) => (
          <CravingToolCard
            key={tool.id}
            label={tool.label}
            description={tool.description}
            icon={tool.icon}
            colors={isDark ? tool.darkColors : tool.colors}
            onPress={() => router.push(tool.href)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

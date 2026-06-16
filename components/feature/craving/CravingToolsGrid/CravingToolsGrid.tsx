import { safeRouter } from "@/utils/app/safeRouter";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CravingToolCard } from "@/components/feature/craving/CravingToolCard";
import { CRAVING_TOOLS } from "@/constants/craving/cravingTools";

export function CravingToolsGrid() {
  return (
    <Animated.View entering={FadeInUp.delay(180).duration(450)}>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {CRAVING_TOOLS.map((tool) => (
          <CravingToolCard
            key={tool.id}
            label={tool.label}
            description={tool.description}
            icon={tool.icon}
            variant={tool.variant}
            onPress={() => safeRouter.push(tool.href)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

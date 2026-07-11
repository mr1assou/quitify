import { useFocusEffect } from "expo-router";
import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CravingToolCard } from "@/components/feature/craving/CravingToolCard";
import { RelaxSoundHeadphonesModal } from "@/components/feature/craving/relax-sound/RelaxSoundHeadphonesModal";
import { type CravingToolId } from "@/constants/craving/cravingTools";
import { isPremiumCravingTool } from "@/constants/premium/premiumFeatures";
import { useCravingTools } from "@/hooks/i18n/useCravingTools";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";

export function CravingToolsGrid() {
  const tools = useCravingTools();
  const { isPremium, requirePremium } = usePremiumGate();
  const [loadingToolId, setLoadingToolId] = useState<CravingToolId | null>(null);
  const [showRelaxHeadphonesModal, setShowRelaxHeadphonesModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoadingToolId(null);
    }, []),
  );

  const openTool = (tool: (typeof tools)[number]) => {
    if (isPremiumCravingTool(tool.id) && !requirePremium()) return;

    if (tool.id === "relax-sound") {
      setShowRelaxHeadphonesModal(true);
      return;
    }

    setLoadingToolId(tool.id);
    safeRouter.push(tool.href);
  };

  return (
    <>
      <Animated.View entering={FadeInUp.delay(180).duration(450)}>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {tools.map((tool) => (
            <CravingToolCard
              key={tool.id}
              label={tool.label}
              description={tool.description}
              icon={tool.icon}
              variant={tool.variant}
              loading={loadingToolId === tool.id}
              locked={!isPremium && isPremiumCravingTool(tool.id)}
              onPress={() => openTool(tool)}
            />
          ))}
        </View>
      </Animated.View>

      <RelaxSoundHeadphonesModal
        visible={showRelaxHeadphonesModal}
        onContinue={() => {
          setShowRelaxHeadphonesModal(false);
          setLoadingToolId("relax-sound");
          safeRouter.push("/craving-tools/relax-sound");
        }}
        onClose={() => setShowRelaxHeadphonesModal(false)}
      />
    </>
  );
}

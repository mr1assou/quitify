import { useFocusEffect } from "expo-router";
import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CravingToolCard } from "@/components/feature/craving/CravingToolCard";
import { RelaxSoundHeadphonesModal } from "@/components/feature/craving/relax-sound/RelaxSoundHeadphonesModal";
import { CRAVING_TOOLS, type CravingToolId } from "@/constants/craving/cravingTools";

export function CravingToolsGrid() {
  const [loadingToolId, setLoadingToolId] = useState<CravingToolId | null>(null);
  const [showRelaxHeadphonesModal, setShowRelaxHeadphonesModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoadingToolId(null);
    }, []),
  );

  const openRelaxSounds = () => {
    setLoadingToolId("relax-sound");
    safeRouter.push("/craving-tools/relax-sound");
  };

  return (
    <>
      <Animated.View entering={FadeInUp.delay(180).duration(450)}>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {CRAVING_TOOLS.map((tool) => (
            <CravingToolCard
              key={tool.id}
              label={tool.label}
              description={tool.description}
              icon={tool.icon}
              variant={tool.variant}
              loading={loadingToolId === tool.id}
              onPress={() => {
                if (tool.id === "relax-sound") {
                  setShowRelaxHeadphonesModal(true);
                  return;
                }

                setLoadingToolId(tool.id);
                safeRouter.push(tool.href);
              }}
            />
          ))}
        </View>
      </Animated.View>

      <RelaxSoundHeadphonesModal
        visible={showRelaxHeadphonesModal}
        onContinue={() => {
          setShowRelaxHeadphonesModal(false);
          openRelaxSounds();
        }}
        onClose={() => setShowRelaxHeadphonesModal(false)}
      />
    </>
  );
}

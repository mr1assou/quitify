import { ScrollView, Text } from "react-native";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { CravingTipSection } from "@/components/feature/craving/CravingSupportPhase/CravingTipSection";
import { useCravingTipCycle } from "@/hooks/craving/useCravingTipCycle";

export function TipsScreen() {
  const { tip, shuffle } = useCravingTipCycle();

  return (
    <CravingToolScreen toolId="tips">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-center text-sm leading-5 text-muted-foreground dark:text-d-muted">
          Short, practical ideas to help you ride out the urge.
        </Text>
        <CravingTipSection tip={tip} onShuffle={shuffle} />
      </ScrollView>
    </CravingToolScreen>
  );
}

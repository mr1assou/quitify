import { ScrollView, View } from "react-native";

import { CravingResult } from "@/components/feature/craving/CravingResult";
import type { CravingOutcome } from "@/types";

type Props = {
  initialStage?: "ask" | "smoked";
  onSubmit: (outcome: CravingOutcome) => void;
  onUndoSubmit?: () => void;
  onDone: () => void;
  onOutcomeBackChange?: (handler: (() => void) | null) => void;
  contentTopClassName?: string;
};

export function CravingOutcomePhase({
  initialStage = "ask",
  onSubmit,
  onUndoSubmit,
  onDone,
  onOutcomeBackChange,
  contentTopClassName = "pt-8",
}: Props) {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
      <View className={contentTopClassName}>
        <CravingResult
          initialStage={initialStage}
          onSubmit={onSubmit}
          onUndoSubmit={onUndoSubmit}
          onOutcomeBackChange={onOutcomeBackChange}
          onDone={onDone}
        />
      </View>
    </ScrollView>
  );
}

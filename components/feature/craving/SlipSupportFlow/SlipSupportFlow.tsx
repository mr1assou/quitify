import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingOutcomePhase } from "@/components/feature/craving/CravingOutcomePhase";
import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { useCravingOutcomeLog } from "@/hooks/useCravingOutcomeLog";

export function SlipSupportFlow() {
  const [showOutcomeBack, setShowOutcomeBack] = useState(false);
  const outcomeBackRef = useRef<(() => void) | null>(null);
  const { submit, undo } = useCravingOutcomeLog();

  const close = useCallback(() => router.back(), []);

  const handleOutcomeBackChange = useCallback((handler: (() => void) | null) => {
    outcomeBackRef.current = handler;
    setShowOutcomeBack(!!handler);
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader
        title="Slip support"
        showBack={showOutcomeBack}
        onBack={() => outcomeBackRef.current?.()}
        onClose={close}
      />

      <View className="flex-1">
        <CravingOutcomePhase
          initialStage="smoked"
          contentTopClassName="pt-2"
          onSubmit={submit}
          onUndoSubmit={undo}
          onDone={close}
          onOutcomeBackChange={handleOutcomeBackChange}
        />
      </View>
    </SafeAreaView>
  );
}

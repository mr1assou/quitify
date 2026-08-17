import { View, useWindowDimensions } from "react-native";

import { BreathingCircle } from "@/components/feature/craving/breathing/BreathingCircle";
import { BreathingControls } from "@/components/feature/craving/breathing/BreathingControls";
import { BreathingFinishButton } from "@/components/feature/craving/breathing/BreathingFinishButton";
import { BreathingIdleView } from "@/components/feature/craving/breathing/BreathingIdleView";
import { BreathingPhaseLabel } from "@/components/feature/craving/breathing/BreathingPhaseLabel";
import { BreathingSessionTimer } from "@/components/feature/craving/breathing/BreathingSessionTimer";
import type { BreathingPhaseId } from "@/constants/craving/breathing";
import { useBreathingSession } from "@/hooks/craving/breathing/useBreathingSession";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { TranslationKey } from "@/i18n/translate";

const PHASE_LABEL_KEYS: Record<BreathingPhaseId, TranslationKey> = {
  inhale: "craving.breatheIn",
  "hold-in": "craving.hold",
  exhale: "craving.breatheOut",
  "hold-out": "craving.breatheRest",
};

export function BreathingExercise() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const circleSize = Math.min(width * 0.72, 300);

  const { isStarted, isFinishing, startSession, finishSession, elapsedMs, breathing } =
    useBreathingSession();

  if (!isStarted) {
    return (
      <BreathingIdleView circleSize={circleSize} onStartSession={startSession} />
    );
  }

  return (
    <View className="flex-1 items-center justify-between px-6 pb-6 pt-4">
      <View className="w-full items-center gap-4">
        <BreathingSessionTimer elapsedMs={elapsedMs} />
        <BreathingPhaseLabel
          phaseId={breathing.phase.id}
          label={t(PHASE_LABEL_KEYS[breathing.phase.id])}
        />
      </View>

      <BreathingCircle
        targetScale={breathing.phase.targetScale}
        durationMs={breathing.phase.durationMs}
        isRunning={breathing.isRunning}
        runToken={breathing.runToken}
        size={circleSize}
      />

      <View className="w-full gap-5">
        <BreathingControls
          isRunning={breathing.isRunning}
          cycle={breathing.cycle}
          onToggle={breathing.toggle}
          onReset={breathing.reset}
        />
        <BreathingFinishButton
          onPress={finishSession}
          disabled={isFinishing}
        />
      </View>
    </View>
  );
}

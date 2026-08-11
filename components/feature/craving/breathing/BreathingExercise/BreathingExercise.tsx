import { View, useWindowDimensions } from "react-native";

import { BreathingCircle } from "@/components/feature/craving/breathing/BreathingCircle";
import { BreathingControls } from "@/components/feature/craving/breathing/BreathingControls";
import { BreathingFinishButton } from "@/components/feature/craving/breathing/BreathingFinishButton";
import { BreathingIdleView } from "@/components/feature/craving/breathing/BreathingIdleView";
import { BreathingPhaseLabel } from "@/components/feature/craving/breathing/BreathingPhaseLabel";
import { BreathingSessionTimer } from "@/components/feature/craving/breathing/BreathingSessionTimer";
import { useBreathingSession } from "@/hooks/craving/breathing/useBreathingSession";

export function BreathingExercise() {
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
          label={breathing.phase.label}
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

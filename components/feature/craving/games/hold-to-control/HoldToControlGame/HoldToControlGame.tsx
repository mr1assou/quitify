import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { HoldToControlHud } from "@/components/feature/craving/games/hold-to-control/HoldToControlHud";
import { HoldToControlIdleView } from "@/components/feature/craving/games/hold-to-control/HoldToControlIdleView";
import { HoldToControlPlayField } from "@/components/feature/craving/games/hold-to-control/HoldToControlPlayField";
import { HoldToControlResultView } from "@/components/feature/craving/games/hold-to-control/HoldToControlResultView";
import { useHoldToControlGame } from "@/hooks/useHoldToControlGame";

export function HoldToControlGame() {
  const game = useHoldToControlGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <HoldToControlIdleView onStart={game.start} />;
  }

  if (game.status === "finished") {
    return (
      <HoldToControlResultView
        score={game.score}
        completedWaves={game.completedWaves}
        totalWaves={game.totalWaves}
        totalHoldMs={game.totalHoldMs}
        bestStreak={game.bestStreak}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <HoldToControlHud
        roundIndex={game.roundIndex}
        totalWaves={game.totalWaves}
        holdProgress={game.holdProgress}
        score={game.score}
        streak={game.streak}
      />
      <HoldToControlPlayField
        phase={game.phase}
        holdProgress={game.holdProgress}
        isHolding={game.isHolding}
        currentWaveSec={game.currentWaveSec}
        roundIndex={game.roundIndex}
        onPressIn={game.press}
        onPressOut={game.release}
      />
    </View>
  );
}

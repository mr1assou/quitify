import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { GameDoneBar } from "@/components/feature/craving/games/GameDoneBar";
import { NinjaHud } from "@/components/feature/craving/games/reflex-tap/NinjaHud";
import { NinjaPlayField } from "@/components/feature/craving/games/reflex-tap/NinjaPlayField";
import { NinjaResultView } from "@/components/feature/craving/games/reflex-tap/NinjaResultView";
import { ReflexIdleView } from "@/components/feature/craving/games/reflex-tap/ReflexIdleView";
import { CIGARETTE_NINJA_TARGET_SCORE } from "@/constants/craving/games/cigaretteNinja";
import { useCigaretteNinjaGame } from "@/hooks/craving/games/useCigaretteNinjaGame";

export function ReflexTapGame() {
  const game = useCigaretteNinjaGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <ReflexIdleView onStart={game.start} />;
  }

  if (
    game.status === "won" ||
    game.status === "finished" ||
    game.status === "timedOut"
  ) {
    return (
      <NinjaResultView
        won={game.status === "won"}
        timedOut={game.status === "timedOut"}
        score={game.score}
        targetScore={CIGARETTE_NINJA_TARGET_SCORE}
        bestCombo={game.bestCombo}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <NinjaHud
        score={game.score}
        targetScore={CIGARETTE_NINJA_TARGET_SCORE}
        combo={game.combo}
        secondsLeft={game.secondsLeft}
      />
      <NinjaPlayField
        objects={game.objects}
        trail={game.trail}
        bursts={game.bursts}
        onLayoutField={game.setFieldSize}
        onSwipePoint={game.extendSwipe}
        onSwipeEnd={game.endSwipe}
        onBurstDone={game.clearBurst}
      />
      <GameDoneBar onPress={game.finish} />
    </View>
  );
}

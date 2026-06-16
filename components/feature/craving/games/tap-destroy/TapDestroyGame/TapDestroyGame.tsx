import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { GameDoneBar } from "@/components/feature/craving/games/GameDoneBar";
import { TapDestroyHud } from "@/components/feature/craving/games/tap-destroy/TapDestroyHud";
import { TapDestroyIdleView } from "@/components/feature/craving/games/tap-destroy/TapDestroyIdleView";
import { TapDestroyPlayField } from "@/components/feature/craving/games/tap-destroy/TapDestroyPlayField";
import { TapDestroyResultView } from "@/components/feature/craving/games/tap-destroy/TapDestroyResultView";
import { useTapDestroyGame } from "@/hooks/craving/games/useTapDestroyGame";

export function TapDestroyGame() {
  const {
    status,
    score,
    combo,
    bestCombo,
    secondsLeft,
    cigarettes,
    start,
    finish,
    destroy,
  } = useTapDestroyGame();
  const handleDone = useCallback(() => router.back(), []);

  if (status === "idle") {
    return <TapDestroyIdleView onStart={start} />;
  }

  if (status === "finished") {
    return (
      <TapDestroyResultView
        score={score}
        bestCombo={bestCombo}
        onPlayAgain={start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <TapDestroyHud
        score={score}
        combo={combo}
        secondsLeft={secondsLeft}
      />
      <TapDestroyPlayField cigarettes={cigarettes} onDestroy={destroy} />
      <GameDoneBar onPress={finish} />
    </View>
  );
}

import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { ReflexHud } from "@/components/feature/craving/games/reflex-tap/ReflexHud";
import { ReflexIdleView } from "@/components/feature/craving/games/reflex-tap/ReflexIdleView";
import { ReflexPlayField } from "@/components/feature/craving/games/reflex-tap/ReflexPlayField";
import { ReflexResultView } from "@/components/feature/craving/games/reflex-tap/ReflexResultView";
import { useReflexTapGame } from "@/hooks/useReflexTapGame";

export function ReflexTapGame() {
  const game = useReflexTapGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <ReflexIdleView onStart={game.start} />;
  }

  if (game.status === "finished") {
    return (
      <ReflexResultView
        score={game.score}
        bestCombo={game.bestCombo}
        wrongTaps={game.wrongTaps}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <ReflexHud
        secondsLeft={game.secondsLeft}
        totalSeconds={game.totalSeconds}
        score={game.score}
        combo={game.combo}
      />
      <ReflexPlayField targets={game.targets} onTap={game.tap} />
    </View>
  );
}

import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { TapDestroyHud } from "@/components/feature/craving/games/tap-destroy/TapDestroyHud";
import { TapDestroyIdleView } from "@/components/feature/craving/games/tap-destroy/TapDestroyIdleView";
import { TapDestroyPlayField } from "@/components/feature/craving/games/tap-destroy/TapDestroyPlayField";
import { TapDestroyResultView } from "@/components/feature/craving/games/tap-destroy/TapDestroyResultView";
import { useTapDestroyGame } from "@/hooks/useTapDestroyGame";

export function TapDestroyGame() {
  const game = useTapDestroyGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <TapDestroyIdleView onStart={game.start} />;
  }

  if (game.status === "finished") {
    return (
      <TapDestroyResultView
        score={game.score}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <TapDestroyHud
        secondsLeft={game.secondsLeft}
        totalSeconds={game.totalSeconds}
        score={game.score}
      />
      <TapDestroyPlayField
        cigarettes={game.cigarettes}
        onDestroy={game.destroy}
      />
    </View>
  );
}

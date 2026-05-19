import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { DragHud } from "@/components/feature/craving/games/drag-cigarettes/DragHud";
import { DragIdleView } from "@/components/feature/craving/games/drag-cigarettes/DragIdleView";
import { DragPlayField } from "@/components/feature/craving/games/drag-cigarettes/DragPlayField";
import { DragResultView } from "@/components/feature/craving/games/drag-cigarettes/DragResultView";
import { useDragCigarettesGame } from "@/hooks/useDragCigarettesGame";

export function DragCigarettesGame() {
  const game = useDragCigarettesGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <DragIdleView onStart={game.start} />;
  }

  if (game.status === "finished") {
    return (
      <DragResultView
        trashed={game.trashed}
        bestCombo={game.bestCombo}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <DragHud
        secondsLeft={game.secondsLeft}
        totalSeconds={game.totalSeconds}
        trashed={game.trashed}
        combo={game.combo}
      />
      <DragPlayField
        cigarettes={game.cigarettes}
        trashed={game.trashed}
        onTrash={game.trash}
      />
    </View>
  );
}

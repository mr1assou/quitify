import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

import { CalmPuzzleIdleView } from "@/components/feature/craving/games/calm-focus-puzzle/CalmPuzzleIdleView";
import { CalmPuzzleResultView } from "@/components/feature/craving/games/calm-focus-puzzle/CalmPuzzleResultView";
import { PuzzleBoard } from "@/components/feature/craving/games/calm-focus-puzzle/PuzzleBoard";
import { PuzzleHud } from "@/components/feature/craving/games/calm-focus-puzzle/PuzzleHud";
import { useCalmFocusPuzzleGame } from "@/hooks/useCalmFocusPuzzleGame";

export function CalmFocusPuzzleGame() {
  const game = useCalmFocusPuzzleGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <CalmPuzzleIdleView onStart={game.start} />;
  }

  if (game.status === "finished") {
    return (
      <CalmPuzzleResultView
        score={game.score}
        linesCleared={game.linesCleared}
        bestCombo={game.bestCombo}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <PuzzleHud
        secondsLeft={game.secondsLeft}
        totalSeconds={game.totalSeconds}
        score={game.score}
        linesCleared={game.linesCleared}
        combo={game.combo}
      />
      <PuzzleBoard
        cells={game.cells}
        tray={game.tray}
        onPlace={game.place}
        onRotate={game.rotate}
        lineClearTick={game.lineClearTick}
        fullClearTick={game.fullClearTick}
      />
    </View>
  );
}

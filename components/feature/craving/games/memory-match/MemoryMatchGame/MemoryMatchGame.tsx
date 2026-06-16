import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

import { GameDoneBar } from "@/components/feature/craving/games/GameDoneBar";
import { MemoryBoard } from "@/components/feature/craving/games/memory-match/MemoryBoard";
import { MemoryHud } from "@/components/feature/craving/games/memory-match/MemoryHud";
import { MemoryIdleView } from "@/components/feature/craving/games/memory-match/MemoryIdleView";
import { MemoryPreviewHud } from "@/components/feature/craving/games/memory-match/MemoryPreviewHud";
import { MemoryResultView } from "@/components/feature/craving/games/memory-match/MemoryResultView";
import { useMemoryMatchGame } from "@/hooks/craving/games/useMemoryMatchGame";

export function MemoryMatchGame() {
  const game = useMemoryMatchGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <MemoryIdleView onStart={game.start} />;
  }

  if (game.status === "won" || game.status === "finished" || game.status === "timedOut") {
    return (
      <MemoryResultView
        matchedPairs={game.matchedPairs}
        totalPairs={game.totalPairs}
        moves={game.moves}
        won={game.status === "won"}
        timedOut={game.status === "timedOut"}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  const isPreview = game.status === "preview";

  return (
    <View className="flex-1">
      {isPreview ? (
        <MemoryPreviewHud secondsLeft={game.previewSecondsLeft} />
      ) : (
        <MemoryHud
          matchedPairs={game.matchedPairs}
          totalPairs={game.totalPairs}
          moves={game.moves}
          secondsLeft={game.secondsLeft}
        />
      )}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MemoryBoard
          cards={game.cards}
          locked={isPreview || game.locked}
          onFlip={game.flip}
        />
      </ScrollView>
      {!isPreview ? <GameDoneBar onPress={game.finish} /> : null}
    </View>
  );
}

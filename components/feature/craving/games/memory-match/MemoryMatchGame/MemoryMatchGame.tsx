import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";

import { MemoryBoard } from "@/components/feature/craving/games/memory-match/MemoryBoard";
import { MemoryHud } from "@/components/feature/craving/games/memory-match/MemoryHud";
import { MemoryIdleView } from "@/components/feature/craving/games/memory-match/MemoryIdleView";
import { MemoryResultView } from "@/components/feature/craving/games/memory-match/MemoryResultView";
import { useMemoryMatchGame } from "@/hooks/useMemoryMatchGame";

export function MemoryMatchGame() {
  const game = useMemoryMatchGame();
  const handleDone = useCallback(() => router.back(), []);

  if (game.status === "idle") {
    return <MemoryIdleView onStart={game.start} />;
  }

  if (game.status === "won" || game.status === "timeout") {
    return (
      <MemoryResultView
        status={game.status}
        matchedPairs={game.matchedPairs}
        totalPairs={game.totalPairs}
        moves={game.moves}
        onPlayAgain={game.start}
        onDone={handleDone}
      />
    );
  }

  return (
    <View className="flex-1">
      <MemoryHud
        secondsLeft={game.secondsLeft}
        totalSeconds={game.totalSeconds}
        matchedPairs={game.matchedPairs}
        totalPairs={game.totalPairs}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <MemoryBoard
          cards={game.cards}
          locked={game.locked}
          onFlip={game.flip}
        />
      </ScrollView>
    </View>
  );
}

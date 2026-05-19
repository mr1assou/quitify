import { router, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { CalmFocusPuzzleGame } from "@/components/feature/craving/games/calm-focus-puzzle/CalmFocusPuzzleGame";
import { DragCigarettesGame } from "@/components/feature/craving/games/drag-cigarettes/DragCigarettesGame";
import { HoldToControlGame } from "@/components/feature/craving/games/hold-to-control/HoldToControlGame";
import { MemoryMatchGame } from "@/components/feature/craving/games/memory-match/MemoryMatchGame";
import { ReflexTapGame } from "@/components/feature/craving/games/reflex-tap/ReflexTapGame";
import { TapDestroyGame } from "@/components/feature/craving/games/tap-destroy/TapDestroyGame";
import { getCravingGame } from "@/constants/cravingGames";

/** Router for a single craving game — picks the right gameplay screen by id. */
export function GamePlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = id ? getCravingGame(id) : undefined;
  const close = useCallback(() => router.back(), []);

  if (!game) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background px-6 dark:bg-d-bg"
        edges={["top", "bottom"]}
      >
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          This game does not exist.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-d-bg"
      edges={["top", "bottom"]}
    >
      <CravingSessionHeader
        title={game.title}
        showBack
        onBack={close}
        onClose={close}
      />
      {game.id === "tap-destroy-cigarettes" ? (
        <TapDestroyGame />
      ) : game.id === "memory-match" ? (
        <MemoryMatchGame />
      ) : game.id === "reflex-tap" ? (
        <ReflexTapGame />
      ) : game.id === "drag-cigarettes-trash" ? (
        <DragCigarettesGame />
      ) : game.id === "calm-focus-puzzle" ? (
        <CalmFocusPuzzleGame />
      ) : game.id === "hold-to-control" ? (
        <HoldToControlGame />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            Coming soon.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { BreathingExercise } from "@/components/feature/craving/breathing/BreathingExercise";
import { MemoryMatchGame } from "@/components/feature/craving/games/memory-match/MemoryMatchGame";
import { ReflexTapGame } from "@/components/feature/craving/games/reflex-tap/ReflexTapGame";
import { getCravingGame } from "@/constants/craving/games/cravingGames";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { safeRouter } from "@/utils/app/safeRouter";
import { isGameUnlocked } from "@/utils/premium/gameAccess";

/** Router for a single craving game — picks the right gameplay screen by id. */
export function GamePlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isPremium, requirePremium } = usePremiumGate();
  const game = id ? getCravingGame(id) : undefined;
  const unlocked = game ? isGameUnlocked(game.id, isPremium) : false;
  const close = useCallback(() => router.back(), []);

  useEffect(() => {
    if (!game || unlocked) return;
    requirePremium();
    safeRouter.back();
  }, [game, unlocked, requirePremium]);

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

  if (!unlocked) return null;

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
      {game.id === "breathing" ? (
        <BreathingExercise />
      ) : game.id === "memory-match" ? (
        <MemoryMatchGame />
      ) : game.id === "reflex-tap" ? (
        <ReflexTapGame />
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

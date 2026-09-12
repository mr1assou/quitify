import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CravingSessionHeader } from "@/components/feature/craving/CravingSessionHeader";
import { useTheme } from "@/context/ThemeContext";
import { useLocalizedCravingGame } from "@/hooks/i18n/useLocalizedCravingGames";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { safeRouter } from "@/utils/app/safeRouter";
import { isGameUnlocked } from "@/utils/premium/gameAccess";

type GameId = "breathing" | "memory-match" | "reflex-tap";

async function loadGameComponent(
  gameId: GameId,
): Promise<ComponentType> {
  switch (gameId) {
    case "breathing": {
      const mod = await import(
        "@/components/feature/craving/breathing/BreathingExercise"
      );
      return mod.BreathingExercise;
    }
    case "memory-match": {
      const mod = await import(
        "@/components/feature/craving/games/memory-match/MemoryMatchGame"
      );
      return mod.MemoryMatchGame;
    }
    case "reflex-tap": {
      const mod = await import(
        "@/components/feature/craving/games/reflex-tap/ReflexTapGame"
      );
      return mod.ReflexTapGame;
    }
  }
}

/** Router for a single craving game — loads only the selected game module. */
export function GamePlayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium, requirePremium } = usePremiumGate();
  const game = useLocalizedCravingGame(id);
  const unlocked = game ? isGameUnlocked(game.id, isPremium) : false;
  const close = useCallback(() => router.back(), []);
  const [GameComponent, setGameComponent] = useState<ComponentType | null>(
    null,
  );

  useEffect(() => {
    if (!game || unlocked) return;
    requirePremium();
    safeRouter.back();
  }, [game, unlocked, requirePremium]);

  useEffect(() => {
    if (!game || !unlocked) {
      setGameComponent(null);
      return;
    }
    if (
      game.id !== "breathing" &&
      game.id !== "memory-match" &&
      game.id !== "reflex-tap"
    ) {
      setGameComponent(null);
      return;
    }

    let cancelled = false;
    setGameComponent(null);
    void loadGameComponent(game.id).then((Component) => {
      if (!cancelled) setGameComponent(() => Component);
    });

    return () => {
      cancelled = true;
    };
  }, [game, unlocked]);

  if (!game) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background px-6 dark:bg-d-bg"
        edges={["top", "bottom"]}
      >
        <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
          {t("craving.gameMissing")}
        </Text>
      </SafeAreaView>
    );
  }

  if (!unlocked) return null;

  const knownGame =
    game.id === "breathing" ||
    game.id === "memory-match" ||
    game.id === "reflex-tap";

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
      {!knownGame ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-muted-foreground dark:text-d-muted">
            {t("craving.comingSoon")}
          </Text>
        </View>
      ) : GameComponent == null ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <GameComponent />
      )}
    </SafeAreaView>
  );
}

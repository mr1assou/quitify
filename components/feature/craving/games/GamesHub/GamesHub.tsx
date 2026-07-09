import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameList } from "@/components/feature/craving/games/GameList";
import { CRAVING_GAMES } from "@/constants/craving/games/cravingGames";
import type { CravingGame } from "@/constants/craving/games/cravingGames";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { isGameUnlocked } from "@/utils/premium/gameAccess";

export function GamesHub() {
  const { isPremium, requirePremium } = usePremiumGate();

  const handleGamePress = useCallback(
    (game: CravingGame) => {
      if (!game.available) return;
      if (!isGameUnlocked(game.id, isPremium)) {
        requirePremium();
        return;
      }
      safeRouter.push(game.href);
    },
    [isPremium, requirePremium],
  );

  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <Animated.View entering={FadeInDown.duration(400)} className="mb-4 items-center">
        <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
          Pick a game or breathing exercise
        </Text>
      </Animated.View>

      <View className="flex-1">
        <GameList
          games={CRAVING_GAMES}
          isPremium={isPremium}
          onGamePress={handleGamePress}
        />
      </View>
    </View>
  );
}

import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameList } from "@/components/feature/craving/games/GameList";
import { CRAVING_GAMES } from "@/constants/craving/games/cravingGames";
import type { CravingGame } from "@/constants/craving/games/cravingGames";

export function GamesHub() {
  const handleGamePress = useCallback((game: CravingGame) => {
    if (game.available) safeRouter.push(game.href);
  }, []);

  return (
    <View className="flex-1 px-6 pb-6 pt-2">
      <Animated.View entering={FadeInDown.duration(400)} className="mb-4 items-center">
        <Text className="text-center text-sm text-muted-foreground dark:text-d-muted">
          Pick a game or breathing exercise
        </Text>
      </Animated.View>

      <View className="flex-1">
        <GameList games={CRAVING_GAMES} onGamePress={handleGamePress} />
      </View>
    </View>
  );
}

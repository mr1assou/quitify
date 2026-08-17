import { safeRouter } from "@/utils/app/safeRouter";
import { useCallback } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameList } from "@/components/feature/craving/games/GameList";
import type { CravingGame } from "@/constants/craving/games/cravingGames";
import { useLocalizedCravingGames } from "@/hooks/i18n/useLocalizedCravingGames";
import { usePremiumGate } from "@/hooks/premium/usePremiumGate";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { isGameUnlocked } from "@/utils/premium/gameAccess";

export function GamesHub() {
  const { t } = useTranslation();
  const games = useLocalizedCravingGames();
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
          {t("craving.gamesHubSubtitle")}
        </Text>
      </Animated.View>

      <View className="flex-1">
        <GameList
          games={games}
          isPremium={isPremium}
          onGamePress={handleGamePress}
        />
      </View>
    </View>
  );
}

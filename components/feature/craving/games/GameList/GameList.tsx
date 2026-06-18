import { FlatList, useWindowDimensions, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { GameCard } from "@/components/feature/craving/games/GameCard";
import type { CravingGame } from "@/constants/craving/games/cravingGames";

const COLUMN_GAP = 12;
const ROW_GAP = 12;
/** Matches horizontal padding on `GamesHub` (`px-6` × 2). */
const HUB_HORIZONTAL_PADDING = 48;

type Props = {
  games: readonly CravingGame[];
  onGamePress: (game: CravingGame) => void;
};

export function GameList({ games, onGamePress }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - HUB_HORIZONTAL_PADDING - COLUMN_GAP) / 2;

  return (
    <FlatList
      data={games}
      numColumns={2}
      keyExtractor={(item) => item.id}
      columnWrapperStyle={{ gap: COLUMN_GAP }}
      ItemSeparatorComponent={() => <View style={{ height: ROW_GAP }} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeInUp.delay(50 + index * 45).duration(380)}
          style={{ width: cardWidth }}
        >
          <GameCard
            game={item}
            onPress={() => {
              if (item.available) onGamePress(item);
            }}
          />
        </Animated.View>
      )}
    />
  );
}

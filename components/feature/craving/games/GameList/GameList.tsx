import { FlatList, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { GameCard } from "@/components/feature/craving/games/GameCard";
import type { CravingGame } from "@/constants/craving/games/cravingGames";

const COLUMN_GAP = 12;
const ROW_GAP = 12;

type Props = {
  games: readonly CravingGame[];
  onGamePress: (game: CravingGame) => void;
};

export function GameList({ games, onGamePress }: Props) {
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
          style={{ flex: 1 }}
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

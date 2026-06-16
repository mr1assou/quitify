import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import { MemoryCard } from "@/components/feature/craving/games/memory-match/MemoryCard";
import type { MemoryCard as MemoryCardType } from "@/hooks/craving/games/useMemoryMatchGame";

const COLUMNS = 4;
const GAP = 10;

type Props = {
  cards: readonly MemoryCardType[];
  locked: boolean;
  onFlip: (index: number) => void;
};

export function MemoryBoard({ cards, locked, onFlip }: Props) {
  const [width, setWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) setWidth(w);
  };

  const cardSize =
    width > 0 ? Math.floor((width - GAP * (COLUMNS - 1)) / COLUMNS) : 0;

  return (
    <View
      onLayout={handleLayout}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {cardSize > 0
        ? cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              size={cardSize}
              disabled={locked}
              onPress={() => onFlip(index)}
            />
          ))
        : null}
    </View>
  );
}

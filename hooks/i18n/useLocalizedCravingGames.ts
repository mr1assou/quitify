import { useMemo } from "react";

import {
  CRAVING_GAMES,
  type CravingGame,
  type CravingGameId,
} from "@/constants/craving/games/cravingGames";
import { useTranslation } from "@/hooks/i18n/useTranslation";

const GAME_COPY_KEYS: Record<
  CravingGameId,
  {
    title: "breathingTitle" | "memoryMatchTitle" | "ninjaTitle";
    description: "breathingDescription" | "memoryMatchDescription" | "ninjaDescription";
    duration: "breathingDuration" | "memoryMatchDuration" | "ninjaDuration";
  }
> = {
  breathing: {
    title: "breathingTitle",
    description: "breathingDescription",
    duration: "breathingDuration",
  },
  "memory-match": {
    title: "memoryMatchTitle",
    description: "memoryMatchDescription",
    duration: "memoryMatchDuration",
  },
  "reflex-tap": {
    title: "ninjaTitle",
    description: "ninjaDescription",
    duration: "ninjaDuration",
  },
};

export function useLocalizedCravingGames(): readonly CravingGame[] {
  const { t } = useTranslation();

  return useMemo(
    () =>
      CRAVING_GAMES.map((game) => {
        const keys = GAME_COPY_KEYS[game.id];
        return {
          ...game,
          title: t(`craving.${keys.title}`),
          description: t(`craving.${keys.description}`),
          duration: t(`craving.${keys.duration}`),
        };
      }),
    [t],
  );
}

export function useLocalizedCravingGame(id: string | undefined): CravingGame | undefined {
  const games = useLocalizedCravingGames();
  return useMemo(() => (id ? games.find((game) => game.id === id) : undefined), [games, id]);
}

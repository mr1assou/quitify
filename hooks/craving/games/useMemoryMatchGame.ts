import { useCallback, useEffect, useReducer } from "react";

import {
  MEMORY_MATCH_CARD_COUNT,
  MEMORY_MATCH_DURATION_SEC,
  MEMORY_MATCH_PAIR_COUNT,
  MEMORY_MATCH_PREVIEW_SEC,
  MEMORY_SYMBOLS,
} from "@/constants/craving/games/memoryMatch";

export type MemoryMatchStatus =
  | "idle"
  | "preview"
  | "playing"
  | "won"
  | "finished"
  | "timedOut";

export type MemoryCard = {
  /** Unique card id (`${symbolId}-${0|1}`). */
  id: string;
  symbolId: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type State = {
  status: MemoryMatchStatus;
  cards: MemoryCard[];
  /** Indexes of currently flipped (not yet resolved) cards. */
  flippedIndexes: number[];
  moves: number;
  matchedPairs: number;
  secondsLeft: number;
  previewSecondsLeft: number;
  /** Disables taps during the "no match" reveal delay. */
  locked: boolean;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "previewTick" }
  | { type: "tick" }
  | { type: "flip"; index: number }
  | { type: "resolve" }
  | { type: "finish" };

function shuffle<T>(array: readonly T[]): T[] {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(): MemoryCard[] {
  const cards: MemoryCard[] = [];
  MEMORY_SYMBOLS.forEach((s) => {
    for (let i = 0; i < 2; i += 1) {
      cards.push({
        id: `${s.id}-${i}`,
        symbolId: s.id,
        isFlipped: false,
        isMatched: false,
      });
    }
  });
  return shuffle(cards);
}

function initialState(): State {
  return {
    status: "idle",
    cards: buildDeck(),
    flippedIndexes: [],
    moves: 0,
    matchedPairs: 0,
    secondsLeft: MEMORY_MATCH_DURATION_SEC,
    previewSecondsLeft: MEMORY_MATCH_PREVIEW_SEC,
    locked: false,
  };
}

function revealAllCards(cards: MemoryCard[]): MemoryCard[] {
  return cards.map((c) => ({ ...c, isFlipped: true }));
}

function hideAllCards(cards: MemoryCard[]): MemoryCard[] {
  return cards.map((c) => ({ ...c, isFlipped: false }));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start": {
      const cards = revealAllCards(buildDeck());
      return {
        ...initialState(),
        status: "preview",
        cards,
        previewSecondsLeft: MEMORY_MATCH_PREVIEW_SEC,
        secondsLeft: MEMORY_MATCH_DURATION_SEC,
      };
    }

    case "reset":
      return initialState();

    case "previewTick": {
      if (state.status !== "preview") return state;
      const previewSecondsLeft = state.previewSecondsLeft - 1;
      if (previewSecondsLeft <= 0) {
        return {
          ...state,
          status: "playing",
          previewSecondsLeft: 0,
          cards: hideAllCards(state.cards),
        };
      }
      return { ...state, previewSecondsLeft };
    }

    case "tick": {
      if (state.status !== "playing") return state;
      const secondsLeft = state.secondsLeft - 1;
      if (secondsLeft <= 0) {
        const cards = state.cards.map((c) =>
          c.isMatched ? c : { ...c, isFlipped: false },
        );
        return {
          ...state,
          status: "timedOut",
          secondsLeft: 0,
          cards,
          flippedIndexes: [],
          locked: false,
        };
      }
      return { ...state, secondsLeft };
    }

    case "flip": {
      if (state.status !== "playing" || state.locked) return state;
      const card = state.cards[action.index];
      if (!card || card.isFlipped || card.isMatched) return state;
      if (state.flippedIndexes.length >= 2) return state;

      const cards = state.cards.map((c, i) =>
        i === action.index ? { ...c, isFlipped: true } : c,
      );
      const flippedIndexes = [...state.flippedIndexes, action.index];

      if (flippedIndexes.length < 2) {
        return { ...state, cards, flippedIndexes };
      }

      const [aIdx, bIdx] = flippedIndexes;
      const a = cards[aIdx];
      const b = cards[bIdx];
      const isMatch = a.symbolId === b.symbolId;
      const moves = state.moves + 1;

      if (isMatch) {
        const matchedCards = cards.map((c, i) =>
          i === aIdx || i === bIdx
            ? { ...c, isFlipped: false, isMatched: true }
            : c,
        );
        const matchedPairs = state.matchedPairs + 1;
        const won = matchedPairs >= MEMORY_MATCH_PAIR_COUNT;
        return {
          ...state,
          cards: matchedCards,
          flippedIndexes: [],
          moves,
          matchedPairs,
          status: won ? "won" : "playing",
        };
      }

      return {
        ...state,
        cards,
        flippedIndexes,
        moves,
        locked: true,
      };
    }

    case "resolve": {
      if (!state.locked || state.flippedIndexes.length === 0) return state;
      const [aIdx, bIdx] = state.flippedIndexes;
      const cards = state.cards.map((c, i) =>
        i === aIdx || i === bIdx ? { ...c, isFlipped: false } : c,
      );
      return { ...state, cards, flippedIndexes: [], locked: false };
    }

    case "finish": {
      if (state.status !== "playing") return state;
      const cards = state.cards.map((c) =>
        c.isMatched ? c : { ...c, isFlipped: false },
      );
      return {
        ...state,
        status: "finished",
        cards,
        flippedIndexes: [],
        locked: false,
      };
    }

    default:
      return state;
  }
}

const MISMATCH_DELAY_MS = 850;

/** State + side-effects for the Memory Match mini-game. */
export function useMemoryMatchGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    if (!state.locked) return;
    const id = setTimeout(
      () => dispatch({ type: "resolve" }),
      MISMATCH_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [state.locked]);

  useEffect(() => {
    if (state.status !== "preview") return;
    const id = setInterval(() => dispatch({ type: "previewTick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const flip = useCallback(
    (index: number) => dispatch({ type: "flip", index }),
    [],
  );
  const finish = useCallback(() => dispatch({ type: "finish" }), []);

  return {
    status: state.status,
    cards: state.cards,
    moves: state.moves,
    matchedPairs: state.matchedPairs,
    secondsLeft: state.secondsLeft,
    previewSecondsLeft: state.previewSecondsLeft,
    totalPairs: MEMORY_MATCH_PAIR_COUNT,
    totalCards: MEMORY_MATCH_CARD_COUNT,
    locked: state.locked,
    start,
    reset,
    flip,
    finish,
  };
}

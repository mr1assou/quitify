import { useCallback, useEffect, useReducer } from "react";

import {
  MEMORY_MATCH_CARD_COUNT,
  MEMORY_MATCH_DURATION_SEC,
  MEMORY_MATCH_PAIR_COUNT,
  MEMORY_SYMBOLS,
} from "@/constants/memoryMatch";

export type MemoryMatchStatus = "idle" | "playing" | "won" | "timeout";

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
  secondsLeft: number;
  moves: number;
  matchedPairs: number;
  /** Disables taps during the "no match" reveal delay. */
  locked: boolean;
};

type Action =
  | { type: "start" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "flip"; index: number }
  | { type: "resolve" };

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
    secondsLeft: MEMORY_MATCH_DURATION_SEC,
    moves: 0,
    matchedPairs: 0,
    locked: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...initialState(),
        status: "playing",
      };

    case "reset":
      return initialState();

    case "tick": {
      if (state.status !== "playing") return state;
      const next = state.secondsLeft - 1;
      if (next <= 0) return { ...state, status: "timeout", secondsLeft: 0 };
      return { ...state, secondsLeft: next };
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

      // Second card just flipped — check for a match.
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

      // Mismatch — keep them face-up briefly, then flip back via "resolve".
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

    default:
      return state;
  }
}

const MISMATCH_DELAY_MS = 850;

/** State + side-effects for the Memory Match mini-game. */
export function useMemoryMatchGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // Countdown.
  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(id);
  }, [state.status]);

  // Auto-flip mismatched pair back after a short reveal.
  useEffect(() => {
    if (!state.locked) return;
    const id = setTimeout(
      () => dispatch({ type: "resolve" }),
      MISMATCH_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [state.locked]);

  const start = useCallback(() => dispatch({ type: "start" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const flip = useCallback(
    (index: number) => dispatch({ type: "flip", index }),
    [],
  );

  return {
    status: state.status,
    cards: state.cards,
    secondsLeft: state.secondsLeft,
    totalSeconds: MEMORY_MATCH_DURATION_SEC,
    moves: state.moves,
    matchedPairs: state.matchedPairs,
    totalPairs: MEMORY_MATCH_PAIR_COUNT,
    totalCards: MEMORY_MATCH_CARD_COUNT,
    locked: state.locked,
    start,
    reset,
    flip,
  };
}

export type SavedCardsSection = "tips" | "motivation";

export const SAVED_CARDS_SECTIONS: readonly {
  id: SavedCardsSection;
  label: string;
}[] = [
  { id: "tips", label: "Tips" },
  { id: "motivation", label: "Motivation" },
] as const;

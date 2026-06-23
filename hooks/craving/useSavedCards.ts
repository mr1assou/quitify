import { useCallback, useMemo } from "react";

import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { useApp } from "@/context/AppContext";
import { updateUserPreferences } from "@/services/auth/preferencesApi";
import { getAccessToken } from "@/utils/auth/authStorage";

type SavedIdsKey = "savedTipCardIds" | "savedMotivationCardIds";

const IDS_KEY_BY_SECTION: Record<SavedCardsSection, SavedIdsKey> = {
  tips: "savedTipCardIds",
  motivation: "savedMotivationCardIds",
};

export function useSavedCards() {
  const { state, setAccount } = useApp();
  const account = state.account;

  const savedTipCardIds = useMemo(
    () => account?.savedTipCardIds ?? [],
    [account?.savedTipCardIds],
  );
  const savedMotivationCardIds = useMemo(
    () => account?.savedMotivationCardIds ?? [],
    [account?.savedMotivationCardIds],
  );

  const idsForSection = useCallback(
    (section: SavedCardsSection) =>
      section === "tips" ? savedTipCardIds : savedMotivationCardIds,
    [savedMotivationCardIds, savedTipCardIds],
  );

  const isSaved = useCallback(
    (section: SavedCardsSection, cardId: string) =>
      idsForSection(section).includes(cardId),
    [idsForSection],
  );

  const toggleSaved = useCallback(
    async (section: SavedCardsSection, cardId: string) => {
      const key = IDS_KEY_BY_SECTION[section];
      const current = idsForSection(section);
      const next = current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId];

      if (account) {
        setAccount({ ...account, [key]: next });
      }

      const token = await getAccessToken();
      if (!token) return;

      try {
        await updateUserPreferences({ [key]: next });
      } catch {
        if (account) {
          setAccount({ ...account, [key]: current });
        }
      }
    },
    [account, idsForSection, setAccount],
  );

  return {
    savedTipCardIds,
    savedMotivationCardIds,
    idsForSection,
    isSaved,
    toggleSaved,
  };
}

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { useTheme } from "@/context/ThemeContext";
import { useSavedCards } from "@/hooks/craving/useSavedCards";

type Props = {
  section: SavedCardsSection;
  cardId: string;
};

export function SaveCardButton({ section, cardId }: Props) {
  const { colors } = useTheme();
  const { isSaved, toggleSaved } = useSavedCards();
  const [pending, setPending] = useState(false);

  const saved = isSaved(section, cardId);
  const label = saved ? "Saved" : "Save";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved" : "Save card"}
      accessibilityState={{ selected: saved, busy: pending }}
      disabled={pending}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        setPending(true);
        void toggleSaved(section, cardId).finally(() => setPending(false));
      }}
      className="mt-5 flex-row items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 dark:border-d-border dark:bg-d-surface"
    >
      {pending ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={18}
          color={colors.primary}
        />
      )}
      <Text className="text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
    </Pressable>
  );
}

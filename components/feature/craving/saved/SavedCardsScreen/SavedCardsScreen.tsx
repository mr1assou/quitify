import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { MotivationCardStack } from "@/components/feature/craving/motivation-cards/MotivationCardStack";
import { SaveCardButton } from "@/components/feature/craving/saved/SaveCardButton";
import { SavedCardsSectionTabs } from "@/components/feature/craving/saved/SavedCardsSectionTabs";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { useTheme } from "@/context/ThemeContext";
import { useSavedCards } from "@/hooks/craving/useSavedCards";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { resolveSavedQuotes } from "@/utils/craving/savedCardsCatalog";

export function SavedCardsScreen() {
  const { t, locale } = useTranslation();
  const { colors } = useTheme();
  const [section, setSection] = useState<SavedCardsSection>("tips");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { idsForSection } = useSavedCards();

  const savedQuotes = useMemo(
    () => resolveSavedQuotes(section, idsForSection(section), locale),
    [idsForSection, section, locale],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [section]);

  useEffect(() => {
    if (savedQuotes.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, savedQuotes.length - 1));
  }, [savedQuotes.length]);

  const currentQuote = savedQuotes[currentIndex];
  const emptyTitle =
    section === "tips" ? t("craving.savedTipsEmpty") : t("craving.savedMotivationEmpty");
  const emptySubtitle =
    section === "tips" ? t("craving.savedTipsHint") : t("craving.savedMotivationHint");

  return (
    <CravingToolScreen toolId="saved">
      <View className="flex-1 px-5 pb-6 pt-2">
        <SavedCardsSectionTabs value={section} onChange={setSection} />

        {savedQuotes.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-section dark:bg-d-surface">
              <Ionicons
                name="bookmark-outline"
                size={28}
                color={colors.mutedForeground}
              />
            </View>
            <Text className="text-center text-base font-semibold text-foreground dark:text-d-text">
              {emptyTitle}
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground dark:text-d-muted">
              {emptySubtitle}
            </Text>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center pt-4">
            <Text className="mb-4 text-xs text-muted-foreground dark:text-d-muted">
              Swipe for another saved card
            </Text>

            <MotivationCardStack
              quotes={savedQuotes}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
            />

            {currentQuote ? (
              <SaveCardButton section={section} cardId={currentQuote.id} />
            ) : null}
          </View>
        )}
      </View>
    </CravingToolScreen>
  );
}

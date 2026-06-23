import { Text, View } from "react-native";

import { SaveCardButton } from "@/components/feature/craving/saved/SaveCardButton";
import { MotivationCardStack } from "@/components/feature/craving/motivation-cards/MotivationCardStack";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";

type Props = {
  quotes: readonly MotivationQuote[];
  currentIndex: number;
  onIndexChange: (next: number) => void;
  hintText?: string;
  saveSection?: SavedCardsSection;
};

export function MotivationCardsSession({
  quotes,
  currentIndex,
  onIndexChange,
  hintText = "Swipe for another message",
  saveSection,
}: Props) {
  const currentQuote = quotes[currentIndex];

  return (
    <View className="flex-1 items-center justify-center px-6 pb-6 pt-2">
      <Text className="mb-4 text-xs text-muted-foreground dark:text-d-muted">
        {hintText}
      </Text>

      <MotivationCardStack
        quotes={quotes}
        currentIndex={currentIndex}
        onIndexChange={onIndexChange}
      />

      {saveSection && currentQuote ? (
        <SaveCardButton section={saveSection} cardId={currentQuote.id} />
      ) : null}
    </View>
  );
}

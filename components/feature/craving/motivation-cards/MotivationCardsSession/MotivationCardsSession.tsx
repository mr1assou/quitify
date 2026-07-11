import { Text, View } from "react-native";

import { SaveCardButton } from "@/components/feature/craving/saved/SaveCardButton";
import { MotivationCardStack } from "@/components/feature/craving/motivation-cards/MotivationCardStack";
import type { MotivationQuote } from "@/constants/craving/motivationCardTypes";
import type { SavedCardsSection } from "@/constants/craving/savedCardsSections";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type Props = {
  quotes: readonly MotivationQuote[];
  currentIndex: number;
  onIndexChange: (next: number) => void;
  hintText?: string;
  saveSection?: SavedCardsSection;
  canGoToIndex?: (nextIndex: number) => boolean;
  onSwipeBlocked?: () => void;
  displayTotal?: number;
};

export function MotivationCardsSession({
  quotes,
  currentIndex,
  onIndexChange,
  hintText,
  saveSection,
  canGoToIndex,
  onSwipeBlocked,
  displayTotal,
}: Props) {
  const { t } = useTranslation();
  const resolvedHint = hintText ?? t("craving.swipeMessage");
  const currentQuote = quotes[currentIndex];

  return (
    <View className="flex-1 items-center justify-center px-6 pb-6 pt-2">
      <Text className="mb-4 text-xs text-muted-foreground dark:text-d-muted">
        {resolvedHint}
      </Text>

      <MotivationCardStack
        quotes={quotes}
        currentIndex={currentIndex}
        onIndexChange={onIndexChange}
        canGoToIndex={canGoToIndex}
        onSwipeBlocked={onSwipeBlocked}
        displayTotal={displayTotal}
      />

      {saveSection && currentQuote ? (
        <SaveCardButton section={saveSection} cardId={currentQuote.id} />
      ) : null}
    </View>
  );
}

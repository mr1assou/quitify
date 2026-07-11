import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { MotivationCardsSession } from "@/components/feature/craving/motivation-cards/MotivationCardsSession";
import { useTipsCardsSession } from "@/hooks/craving/useTipsCardsSession";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export function TipsScreen() {
  const { t } = useTranslation();
  const {
    quotes,
    currentIndex,
    goToIndex,
    canGoToIndex,
    requirePremium,
    displayTotal,
  } = useTipsCardsSession();

  return (
    <CravingToolScreen toolId="tips">
      <MotivationCardsSession
        quotes={quotes}
        currentIndex={currentIndex}
        onIndexChange={goToIndex}
        canGoToIndex={canGoToIndex}
        onSwipeBlocked={requirePremium}
        displayTotal={displayTotal}
        hintText={t("craving.swipeTip")}
        saveSection="tips"
      />
    </CravingToolScreen>
  );
}

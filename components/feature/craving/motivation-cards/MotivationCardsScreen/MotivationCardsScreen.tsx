import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { MotivationCardsSession } from "@/components/feature/craving/motivation-cards/MotivationCardsSession";
import { useMotivationCardsSession } from "@/hooks/craving/useMotivationCardsSession";

export function MotivationCardsScreen() {
  const { quotes, currentIndex, goToIndex } = useMotivationCardsSession();

  return (
    <CravingToolScreen toolId="motivation-cards">
      <MotivationCardsSession
        quotes={quotes}
        currentIndex={currentIndex}
        onIndexChange={goToIndex}
      />
    </CravingToolScreen>
  );
}

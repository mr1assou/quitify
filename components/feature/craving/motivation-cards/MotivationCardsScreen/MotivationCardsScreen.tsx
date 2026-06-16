import { CravingToolScreen } from "@/components/feature/craving/CravingToolScreen";
import { MotivationCardsIdleView } from "@/components/feature/craving/motivation-cards/MotivationCardsIdleView";
import { MotivationCardsSession } from "@/components/feature/craving/motivation-cards/MotivationCardsSession";
import { useMotivationCardsSession } from "@/hooks/craving/useMotivationCardsSession";

export function MotivationCardsScreen() {
  const {
    isStarted,
    startSession,
    finishSession,
    elapsedMs,
    quotes,
    currentIndex,
    goToIndex,
  } = useMotivationCardsSession();

  return (
    <CravingToolScreen toolId="motivation-cards">
      {!isStarted ? (
        <MotivationCardsIdleView onStartSession={startSession} />
      ) : (
        <MotivationCardsSession
          elapsedMs={elapsedMs}
          quotes={quotes}
          currentIndex={currentIndex}
          onIndexChange={goToIndex}
          onFinish={finishSession}
        />
      )}
    </CravingToolScreen>
  );
}

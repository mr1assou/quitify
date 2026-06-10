import { CigaretteCountStep } from "@/components/feature/craving/CigaretteCountStep";
import { SlipOutcomeResult } from "@/components/feature/craving/CravingResult/outcome/SlipOutcomeResult";
import { AskStage } from "@/components/feature/craving/CravingResult/stages/AskStage";
import { ResistedSuccessStage } from "@/components/feature/craving/CravingResult/stages/ResistedSuccessStage";
import { SmokedChoiceStage } from "@/components/feature/craving/CravingResult/stages/SmokedChoiceStage";
import { useSmokedHeroSize } from "@/components/feature/craving/CravingResult/useSmokedHeroSize";
import { LAPSE_CIGARETTE_COUNT } from "@/constants/slipCigaretteCounts";
import { LAPSE_OUTCOME_COPY, RELAPSE_OUTCOME_COPY } from "@/constants/slipOutcomeCopy";
import { useCravingResultFlow } from "@/hooks/useCravingResultFlow";
import type { CravingResultInitialStage, CravingResultSubmitInput } from "@/types/slipFlow";

export type CravingResultProps = {
  onSubmit: (input: CravingResultSubmitInput) => void | Promise<void>;
  onUndoSubmit?: () => void | Promise<void>;
  onDone: () => void;
  onOutcomeBackChange?: (handler: (() => void) | null) => void;
  initialStage?: CravingResultInitialStage;
  isSubmitting?: boolean;
};

export function CravingResult({
  onSubmit,
  onUndoSubmit,
  onDone,
  onOutcomeBackChange,
  initialStage = "ask",
  isSubmitting = false,
}: CravingResultProps) {
  const heroSize = useSmokedHeroSize();
  const { stage, setStage, submitSlip, submitResisted } = useCravingResultFlow({
    initialStage,
    onSubmit,
    onUndoSubmit,
    onOutcomeBackChange,
  });

  switch (stage) {
    case "ask":
      return (
        <AskStage
          onResisted={submitResisted}
          onSmoked={() => setStage("smoked")}
        />
      );

    case "smoked":
      return (
        <SmokedChoiceStage
          heroSize={heroSize}
          isSubmitting={isSubmitting}
          onLapse={() =>
            void submitSlip({ outcome: "lapse", cigarettesCount: LAPSE_CIGARETTE_COUNT })
          }
          onRelapse={() => setStage("count")}
        />
      );

    case "count":
      return (
        <CigaretteCountStep
          isSubmitting={isSubmitting}
          onSelect={(count) => void submitSlip({ outcome: "relapse", cigarettesCount: count })}
        />
      );

    case "done-lapse":
      return <SlipOutcomeResult heroSize={heroSize} {...LAPSE_OUTCOME_COPY} onDone={onDone} />;

    case "done-relapse":
      return <SlipOutcomeResult heroSize={heroSize} {...RELAPSE_OUTCOME_COPY} onDone={onDone} />;

    default:
      return <ResistedSuccessStage onDone={onDone} />;
  }
}

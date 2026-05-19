import { View } from "react-native";

import { CigaretteHabitFields } from "@/components/feature/onboarding/NicotineConsumptionFields/CigaretteHabitFields";
import { QuitPlanFields } from "@/components/feature/onboarding/QuitPlanFields";
import { OnboardingSectionDivider } from "@/components/feature/onboarding/shared/OnboardingSectionDivider";
import type { OnboardingDraft } from "@/types";
import type { QuitMethod } from "@/types/onboarding";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  onSelectQuitMethod: (method: QuitMethod) => void;
};

/** Step 6 body: cigarette habits + quit method. */
export function NicotineConsumptionFields({
  draft,
  patch,
  onSelectQuitMethod,
}: Props) {
  return (
    <View className="w-full gap-8">
      <CigaretteHabitFields draft={draft} patch={patch} />
      <OnboardingSectionDivider />
      <QuitPlanFields draft={draft} onSelectMethod={onSelectQuitMethod} />
    </View>
  );
}

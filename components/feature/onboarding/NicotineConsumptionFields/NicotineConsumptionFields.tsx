import { View } from "react-native";

import { CigaretteHabitFields } from "@/components/feature/onboarding/NicotineConsumptionFields/CigaretteHabitFields";
import type { OnboardingDraft } from "@/types";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
};

/** Step 6 body: cigarette habits. */
export function NicotineConsumptionFields({ draft, patch }: Props) {
  return (
    <View className="w-full">
      <CigaretteHabitFields draft={draft} patch={patch} />
    </View>
  );
}

import { View } from "react-native";

import { CigaretteHabitFields } from "@/components/feature/onboarding/NicotineConsumptionFields/CigaretteHabitFields";
import type { OnboardingDraft } from "@/types";
import type { NicotineFieldErrors } from "@/utils/onboarding/nicotineOnboarding";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  fieldErrors?: NicotineFieldErrors;
};

/** Step 6 body: cigarette habits. */
export function NicotineConsumptionFields({ draft, patch, fieldErrors }: Props) {
  return (
    <View className="w-full">
      <CigaretteHabitFields draft={draft} patch={patch} fieldErrors={fieldErrors} />
    </View>
  );
}

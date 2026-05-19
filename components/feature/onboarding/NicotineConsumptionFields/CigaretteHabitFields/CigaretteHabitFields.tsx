import { Platform, View } from "react-native";

import { NumberLineField } from "@/components/feature/onboarding/NicotineConsumptionFields/NumberLineField";
import type { OnboardingDraft } from "@/types";
import {
  parseOptionalNonNegativeDecimal,
  parseOptionalPositiveDecimal,
} from "@/utils/nicotineFormParsing";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
};

const DECIMAL_KEYBOARD =
  Platform.OS === "android" ? "number-pad" : ("decimal-pad" as const);

export function CigaretteHabitFields({ draft, patch }: Props) {
  return (
    <View className="w-full gap-4">
      <NumberLineField
        label="How many cigarettes do you smoke per day?"
        keyboardType={DECIMAL_KEYBOARD}
        value={draft.cigarettesPerDay}
        treatZeroAsEmpty
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ cigarettesPerDay: 0 });
            return;
          }
          const v = parseOptionalPositiveDecimal(raw);
          if (v !== undefined) patch({ cigarettesPerDay: v });
        }}
      />
      <NumberLineField
        label="How much does one pack cost?"
        keyboardType={DECIMAL_KEYBOARD}
        value={draft.packCost}
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ packCost: undefined });
            return;
          }
          const v = parseOptionalNonNegativeDecimal(raw);
          if (v === undefined) return;
          patch({ packCost: v });
        }}
      />
      <NumberLineField
        label="How many cigarettes are in one pack?"
        keyboardType={DECIMAL_KEYBOARD}
        value={draft.cigarettesPerPack}
        treatZeroAsEmpty
        onRawChangeText={(raw) => {
          if (raw.trim() === "") {
            patch({ cigarettesPerPack: 0 });
            return;
          }
          const v = parseOptionalPositiveDecimal(raw);
          if (v !== undefined) patch({ cigarettesPerPack: v });
        }}
      />
      <NumberLineField
        label="For how many years have you been smoking?"
        keyboardType={DECIMAL_KEYBOARD}
        value={draft.nicotineHabitYears}
        onRawChangeText={(raw) => {
          if (!raw.trim()) {
            patch({ nicotineHabitYears: undefined });
            return;
          }
          const v = parseOptionalNonNegativeDecimal(raw);
          if (v === undefined) return;
          patch({ nicotineHabitYears: v });
        }}
      />
    </View>
  );
}

import { View } from "react-native";

import { QuitMethodPicker } from "@/components/feature/onboarding/QuitPlanFields/QuitMethodPicker";
import type { OnboardingDraft } from "@/types";
import type { QuitMethod } from "@/types/onboarding/onboarding";

type Props = {
  draft: OnboardingDraft;
  onSelectMethod: (method: QuitMethod) => void;
};

/** Step 6 — how the user plans to quit (cold turkey vs gradual). */
export function QuitPlanFields({ draft, onSelectMethod }: Props) {
  return (
    <View className="w-full">
      <QuitMethodPicker
        selected={draft.quitMethod}
        onSelect={onSelectMethod}
      />
    </View>
  );
}

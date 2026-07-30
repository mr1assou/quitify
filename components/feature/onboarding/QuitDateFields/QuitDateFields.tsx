import { QuitStartPresetPicker } from "@/components/feature/onboarding/QuitPlanFields/QuitStartPresetPicker";
import type { OnboardingDraft } from "@/types";
import type { QuitStartPreset } from "@/types/onboarding/onboarding";

type Props = {
  draft: OnboardingDraft;
  onSelectPreset: (preset: QuitStartPreset) => void;
  onMonthChange: (month: number | undefined) => void;
  onDayChange: (day: number | undefined) => void;
  onYearChange: (year: number | undefined) => void;
  error?: string;
};

/** Step 5 — when the user starts their quit journey. */
export function QuitDateFields({
  draft,
  onSelectPreset,
  onMonthChange,
  onDayChange,
  onYearChange,
  error,
}: Props) {
  return (
    <QuitStartPresetPicker
      draft={draft}
      onSelectPreset={onSelectPreset}
      onMonthChange={onMonthChange}
      onDayChange={onDayChange}
      onYearChange={onYearChange}
      error={error}
    />
  );
}

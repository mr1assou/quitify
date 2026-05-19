import { Text, View } from "react-native";

import { CustomQuitDatePicker } from "@/components/feature/onboarding/QuitPlanFields/CustomQuitDatePicker";
import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import {
  QUIT_DATE_CONTROL_HEIGHT,
  QUIT_DATE_PRESET_WIDTH_WHEN_CUSTOM,
  QUIT_START_DROPDOWN_OPTIONS,
  quitStartPresetHint,
} from "@/constants/onboardingQuitPlan";
import type { OnboardingDraft } from "@/types";
import type { QuitStartPreset } from "@/types/onboarding";

type Props = {
  draft: OnboardingDraft;
  onSelectPreset: (preset: QuitStartPreset) => void;
  onMonthChange: (month: number | undefined) => void;
  onDayChange: (day: number | undefined) => void;
  onYearChange: (year: number | undefined) => void;
};

const PRESETS: readonly QuitStartPreset[] = ["now", "tomorrow", "custom"];

function isQuitStartPreset(value: string): value is QuitStartPreset {
  return (PRESETS as readonly string[]).includes(value);
}

export function QuitStartPresetPicker({
  draft,
  onSelectPreset,
  onMonthChange,
  onDayChange,
  onYearChange,
}: Props) {
  const selected = draft.quitStartPreset;
  const isCustom = selected === "custom";
  const hint =
    selected && !isCustom ? quitStartPresetHint(selected) : undefined;

  return (
    <View className="gap-2">
      <OnboardingFieldLabel>Quit date</OnboardingFieldLabel>

      <View className="flex-row items-center gap-2">
        <View
          className={isCustom ? "shrink-0" : "min-w-0 flex-1"}
          style={isCustom ? { width: QUIT_DATE_PRESET_WIDTH_WHEN_CUSTOM } : undefined}
        >
          <SelectFieldString
            fieldLabel="Quit date"
            value={selected}
            placeholder="Select…"
            options={QUIT_START_DROPDOWN_OPTIONS}
            allowClear={false}
            showLabel={false}
            controlHeight={QUIT_DATE_CONTROL_HEIGHT}
            compact={isCustom}
            onChange={(value) => {
              if (value && isQuitStartPreset(value)) onSelectPreset(value);
            }}
          />
        </View>
        {isCustom ? (
          <CustomQuitDatePicker
            draft={draft}
            onMonthChange={onMonthChange}
            onDayChange={onDayChange}
            onYearChange={onYearChange}
          />
        ) : null}
      </View>

      {hint ? (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

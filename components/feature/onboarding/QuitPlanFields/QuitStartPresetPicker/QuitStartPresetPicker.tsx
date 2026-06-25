import { Pressable, Text, View } from "react-native";

import { CustomQuitDatePicker } from "@/components/feature/onboarding/QuitPlanFields/CustomQuitDatePicker";
import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import { useTheme } from "@/context/ThemeContext";
import {
  QUIT_DATE_CONTROL_HEIGHT,
  QUIT_DATE_PRESET_WIDTH_WHEN_CUSTOM,
  QUIT_START_DROPDOWN_OPTIONS,
  QUIT_START_NOW_DROPDOWN_OPTIONS,
} from "@/constants/onboarding/onboardingQuitPlan";
import type { QuitStartDateDraft } from "@/types/onboarding/quitStartDate";
import type { QuitStartPreset } from "@/types/onboarding/onboarding";

type Props = {
  draft: QuitStartDateDraft;
  label?: string;
  /** `stacked` — text link for custom date + full-width month/day/year (reset journey). */
  variant?: "default" | "stacked";
  onSelectPreset: (preset: QuitStartPreset) => void;
  onMonthChange: (month: number | undefined) => void;
  onDayChange: (day: number | undefined) => void;
  onYearChange: (year: number | undefined) => void;
};

const PRESETS: readonly QuitStartPreset[] = ["now", "custom"];

function isQuitStartPreset(value: string): value is QuitStartPreset {
  return (PRESETS as readonly string[]).includes(value);
}

export function QuitStartPresetPicker({
  draft,
  label = "When do you want to start?",
  variant = "default",
  onSelectPreset,
  onMonthChange,
  onDayChange,
  onYearChange,
}: Props) {
  const { colors } = useTheme();
  const selected = draft.quitStartPreset;
  const isCustom = selected === "custom";

  if (variant === "stacked") {
    return (
      <View className="gap-3">
        <OnboardingFieldLabel>{label}</OnboardingFieldLabel>

        {isCustom ? (
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground dark:text-d-text">
              Choose a custom date
            </Text>
            <CustomQuitDatePicker
              draft={draft}
              onMonthChange={onMonthChange}
              onDayChange={onDayChange}
              onYearChange={onYearChange}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectPreset("now")}
              className="self-start active:opacity-70"
            >
              <Text className="text-sm font-semibold text-primary">Start quitting now</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-3">
            <SelectFieldString
              fieldLabel="Quit date"
              value="now"
              placeholder="Select…"
              options={QUIT_START_NOW_DROPDOWN_OPTIONS}
              allowClear={false}
              showLabel={false}
              controlHeight={QUIT_DATE_CONTROL_HEIGHT}
              onChange={() => onSelectPreset("now")}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelectPreset("custom")}
              className="self-start active:opacity-70"
            >
              <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                Choose a custom date
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="gap-2">
      <OnboardingFieldLabel>{label}</OnboardingFieldLabel>

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
    </View>
  );
}

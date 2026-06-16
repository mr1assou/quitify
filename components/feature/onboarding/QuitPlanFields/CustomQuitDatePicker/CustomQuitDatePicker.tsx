import { useMemo } from "react";
import { Text, View } from "react-native";

import { SelectField } from "@/components/ui/SelectField";
import {
  QUIT_DATE_CONTROL_HEIGHT,
  quitStartYearOptions,
} from "@/constants/onboarding/onboardingQuitPlan";
import { MONTH_OPTIONS } from "@/constants/onboarding/onboardingSex";
import type { OnboardingDraft } from "@/types";
import { ymdDayDropdownOptions } from "@/utils/shared/dates";
import {
  customQuitTimestampFromDraft,
  hasFullCustomQuitYmd,
} from "@/utils/onboarding/quitPlan";

type Props = {
  draft: OnboardingDraft;
  onMonthChange: (month: number | undefined) => void;
  onDayChange: (day: number | undefined) => void;
  onYearChange: (year: number | undefined) => void;
};

/** Month / day / year pickers inline beside the quit-date preset dropdown. */
export function CustomQuitDatePicker({
  draft,
  onMonthChange,
  onDayChange,
  onYearChange,
}: Props) {
  const yearOptions = useMemo(() => quitStartYearOptions(), []);
  const dayOptions = useMemo(
    () => ymdDayDropdownOptions(draft.quitStartMonth, draft.quitStartYear),
    [draft.quitStartMonth, draft.quitStartYear],
  );
  const hasAllParts = hasFullCustomQuitYmd(draft);
  const parsed = hasAllParts ? customQuitTimestampFromDraft(draft) : null;
  const showError = hasAllParts && parsed === null;

  return (
    <View className="min-w-0 flex-1 gap-1">
      <View className="flex-row items-center gap-1.5">
        <View className="min-w-0 flex-1">
          <SelectField
            fieldLabel="Month"
            value={draft.quitStartMonth}
            placeholder="Mo"
            options={MONTH_OPTIONS}
            onChange={onMonthChange}
            hideLabel
            controlHeight={QUIT_DATE_CONTROL_HEIGHT}
          />
        </View>
        <View className="min-w-0 flex-1">
          <SelectField
            fieldLabel="Day"
            value={draft.quitStartDay}
            placeholder="Day"
            options={dayOptions}
            onChange={onDayChange}
            hideLabel
            controlHeight={QUIT_DATE_CONTROL_HEIGHT}
          />
        </View>
        <View className="min-w-0 flex-1">
          <SelectField
            fieldLabel="Year"
            value={draft.quitStartYear}
            placeholder="Yr"
            options={yearOptions}
            onChange={onYearChange}
            hideLabel
            controlHeight={QUIT_DATE_CONTROL_HEIGHT}
          />
        </View>
      </View>
      {showError ? (
        <Text className="text-xs text-alert">Pick today or a future date.</Text>
      ) : null}
    </View>
  );
}

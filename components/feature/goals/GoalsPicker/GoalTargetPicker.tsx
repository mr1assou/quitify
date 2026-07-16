import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { formatMinTargetError } from "@/utils/goals/goalLabels";
import { showGoalDaysAheadInfo } from "@/utils/goals/showGoalDaysAheadInfo";
import {
  cigarettesAvoidedAtSmokeFreeDays,
  moneySavedAtSmokeFreeDays,
  type GoalEconomics,
} from "@/utils/goals/goalEconomics";
import {
  formatDaysAheadGoalDeadline,
  formatMinDaysAheadBanner,
  minDaysAheadFromStreakStart,
  smokeFreeDaysFromStreakStart,
  totalSmokeFreeDaysAtGoalDeadline,
} from "@/utils/goals/goalStreakProgress";
import {
  isGoalTargetValid,
  parseGoalTargetInput,
  sanitizeGoalTargetInput,
} from "@/utils/goals/goalTargetInput";
import { currencySymbol, formatNumber } from "@/utils/shared/format";

type Props = {
  streakStart: number;
  now: number;
  currency: string;
  economics: GoalEconomics;
  /** Server-computed minimum; falls back to client streak tiers when omitted. */
  minDaysAheadFromServer?: number;
  initialDays?: number;
  confirmLabel?: string;
  onConfirm: (days: number) => void | Promise<void>;
};

const GOAL_TYPE = "smoke_free_days" as const;

const INPUT_STYLE = {
  flex: 1,
  minWidth: 0,
  paddingHorizontal: 16,
  paddingVertical: 16,
  fontSize: 18,
  fontWeight: "600" as const,
};

function formatSavingsAmount(amount: number): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: amount < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

function ReadOnlyField({
  label,
  value,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  placeholder: string;
  prefix?: string;
}) {
  const { colors } = useTheme();

  return (
    <View className="gap-2">
      <Text className="px-1 text-sm font-semibold text-foreground dark:text-d-text">
        {label}
      </Text>
      <View
        className="flex-row items-center overflow-hidden rounded-2xl bg-section opacity-60 dark:bg-d-surface"
        style={{ minHeight: 56 }}
      >
        {prefix ? (
          <View className="items-center justify-center border-r border-border px-4 dark:border-d-border">
            <Text
              className="text-base font-semibold text-foreground dark:text-d-text"
              style={{ color: colors.foreground }}
            >
              {prefix}
            </Text>
          </View>
        ) : null}
        <TextInput
          editable={false}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          style={{ ...INPUT_STYLE, color: colors.foreground }}
        />
      </View>
    </View>
  );
}

export function GoalTargetPicker({
  streakStart,
  now,
  currency,
  economics,
  minDaysAheadFromServer,
  initialDays,
  confirmLabel = "Set goal",
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  const [daysInput, setDaysInput] = useState(
    initialDays != null ? String(initialDays) : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const streakDays = useMemo(
    () => smokeFreeDaysFromStreakStart(streakStart, now),
    [streakStart, now],
  );

  const minDaysAhead = useMemo(() => {
    const fromStreak = minDaysAheadFromStreakStart(streakStart, now);
    if (minDaysAheadFromServer == null) return fromStreak;
    return Math.max(fromStreak, minDaysAheadFromServer);
  }, [streakStart, now, minDaysAheadFromServer]);

  const parsedDays = parseGoalTargetInput(GOAL_TYPE, daysInput);
  const isValid =
    parsedDays != null && isGoalTargetValid(GOAL_TYPE, parsedDays, minDaysAhead);
  const symbol = currencySymbol(currency);

  const handleDaysChange = useCallback((text: string) => {
    setDaysInput(sanitizeGoalTargetInput(GOAL_TYPE, text));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (parsedDays == null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(parsedDays);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onConfirm, parsedDays]);

  const showGoalPreview = parsedDays != null && parsedDays > 0 && isValid;

  const totalDaysAtGoal = showGoalPreview
    ? totalSmokeFreeDaysAtGoalDeadline(streakStart, now, parsedDays)
    : 0;

  const cigarettesDisplay = showGoalPreview
    ? formatNumber(cigarettesAvoidedAtSmokeFreeDays(totalDaysAtGoal, economics))
    : "";

  const savingsDisplay = showGoalPreview
    ? formatSavingsAmount(moneySavedAtSmokeFreeDays(totalDaysAtGoal, economics))
    : "";

  const deadlineLabel = showGoalPreview
    ? formatDaysAheadGoalDeadline(streakStart, now, parsedDays)
    : null;

  return (
    <View className="gap-5">
      <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
        <View className="flex-row items-start gap-2">
          <Text className="flex-1 text-sm font-semibold text-primary">
            {formatMinDaysAheadBanner(minDaysAhead, streakDays)}
          </Text>
          <Pressable
            onPress={() => showGoalDaysAheadInfo(isValid ? parsedDays ?? undefined : undefined)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="How minimum days ahead works"
            className="mt-0.5 active:opacity-70"
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>

      <View className="gap-2">
        <Text className="px-1 text-sm font-semibold text-foreground dark:text-d-text">
          Days ahead
        </Text>
        <View
          className="flex-row items-center overflow-hidden rounded-2xl bg-section dark:bg-d-surface"
          style={{ minHeight: 56 }}
        >
          <TextInput
            value={daysInput}
            onChangeText={handleDaysChange}
            placeholder={String(minDaysAhead)}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            autoCorrect={false}
            autoComplete="off"
            selectionColor={colors.primary}
            style={{ ...INPUT_STYLE, color: colors.foreground }}
          />
        </View>
      </View>

      {parsedDays != null && !isValid ? (
        <Text className="px-1 text-sm font-medium text-alert">
          {formatMinTargetError(GOAL_TYPE, minDaysAhead)}
        </Text>
      ) : null}

      {deadlineLabel ? (
        <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
          <Text className="text-sm font-semibold text-primary">
            Goal completes at {deadlineLabel} smoke-free
          </Text>
        </View>
      ) : null}

      {showGoalPreview ? (
        <>
          <ReadOnlyField
            label="Cigarettes avoided"
            value={cigarettesDisplay}
            placeholder="0"
          />

          <ReadOnlyField
            label="Money saved"
            value={savingsDisplay}
            placeholder="0"
            prefix={symbol}
          />
        </>
      ) : null}

      <Button
        label={confirmLabel}
        size="lg"
        fullWidth
        loading={isSubmitting}
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit}
      />
    </View>
  );
}

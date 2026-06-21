import { useCallback, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { formatMinTargetError, formatMinTargetLabel } from "@/utils/goals/goalLabels";
import { formatGoalCompletionBonusLabel } from "@/utils/goals/goalCompletionBonus";
import {
  cigarettesAvoidedAtSmokeFreeDays,
  moneySavedAtSmokeFreeDays,
  type GoalEconomics,
} from "@/utils/goals/goalEconomics";
import {
  isGoalTargetValid,
  parseGoalTargetInput,
  sanitizeGoalTargetInput,
} from "@/utils/goals/goalTargetInput";
import { currencySymbol, formatNumber } from "@/utils/shared/format";

type Props = {
  minTarget: number;
  baselineSmokeFreeDays: number;
  currency: string;
  economics: GoalEconomics;
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
  minTarget,
  baselineSmokeFreeDays,
  currency,
  economics,
  initialDays,
  confirmLabel = "Set goal",
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  const [daysInput, setDaysInput] = useState(
    initialDays != null ? String(initialDays) : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedDays = parseGoalTargetInput(GOAL_TYPE, daysInput);
  const isValid =
    parsedDays != null && isGoalTargetValid(GOAL_TYPE, parsedDays, minTarget);
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

  const cigarettesDisplay =
    parsedDays != null && parsedDays > 0
      ? formatNumber(cigarettesAvoidedAtSmokeFreeDays(parsedDays, economics))
      : "";

  const savingsDisplay =
    parsedDays != null && parsedDays > 0
      ? formatSavingsAmount(moneySavedAtSmokeFreeDays(parsedDays, economics))
      : "";

  return (
    <View className="gap-5">
      <Text className="text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
        How many smoke-free days do you want to reach?
      </Text>

      <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
        <Text className="text-sm font-semibold text-primary">
          {formatMinTargetLabel(GOAL_TYPE, minTarget)}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="px-1 text-sm font-semibold text-foreground dark:text-d-text">
          Smoke-free days
        </Text>
        <View
          className="flex-row items-center overflow-hidden rounded-2xl bg-section dark:bg-d-surface"
          style={{ minHeight: 56 }}
        >
          <TextInput
            value={daysInput}
            onChangeText={handleDaysChange}
            placeholder={String(minTarget)}
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            autoCorrect={false}
            autoComplete="off"
            selectionColor={colors.primary}
            style={{ ...INPUT_STYLE, color: colors.foreground }}
          />
        </View>
      </View>

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

      {parsedDays != null && isValid ? (
        <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
          <Text className="text-sm font-semibold text-primary">
            {formatGoalCompletionBonusLabel(
              GOAL_TYPE,
              parsedDays,
              baselineSmokeFreeDays,
              economics,
            )}
          </Text>
        </View>
      ) : null}

      {parsedDays != null && !isValid ? (
        <Text className="px-1 text-sm font-medium text-alert">
          {formatMinTargetError(GOAL_TYPE, minTarget)}
        </Text>
      ) : null}

      <Text className="px-1 text-xs leading-4 text-muted-foreground dark:text-d-muted">
        Cigarettes avoided and money saved update automatically from your goal.
      </Text>

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

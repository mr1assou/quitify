import { Platform, Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import type { GoalType } from "@/types/goals/goal";
import { formatMinTargetError, formatMinTargetLabel, goalTargetHint } from "@/utils/goals/goalLabels";
import {
  goalTargetInputPlaceholder,
  isGoalTargetValid,
  parseGoalTargetInput,
  sanitizeGoalTargetInput,
} from "@/utils/goals/goalTargetInput";

const MONEY_KEYBOARD =
  Platform.OS === "android" ? "number-pad" : ("decimal-pad" as const);

type Props = {
  type: GoalType;
  minTarget: number;
  strictMinTargets: boolean;
  value: string;
  currencySymbol: string;
  onChangeValue: (value: string) => void;
  onConfirm: () => void;
};

export function GoalTargetPicker({
  type,
  minTarget,
  strictMinTargets,
  value,
  currencySymbol,
  onChangeValue,
  onConfirm,
}: Props) {
  const { colors } = useTheme();
  const parsed = parseGoalTargetInput(type, value);
  const isValid = parsed != null && isGoalTargetValid(type, parsed, minTarget);
  const showCurrency = type === "money_saved";

  const handleChange = (text: string) => {
    onChangeValue(sanitizeGoalTargetInput(type, text));
  };

  return (
    <View className="gap-5">
      <Text className="text-center text-base leading-6 text-muted-foreground dark:text-d-muted">
        {goalTargetHint(type, strictMinTargets)}
      </Text>

      <View className="rounded-2xl bg-section px-4 py-3 dark:bg-d-surface">
        <Text className="text-sm font-semibold text-primary">
          {formatMinTargetLabel(type, minTarget, currencySymbol, strictMinTargets)}
        </Text>
      </View>

      <View className="gap-2">
        <View
          className="flex-row items-center overflow-hidden rounded-2xl bg-section dark:bg-d-surface"
          style={{ minHeight: 56 }}
        >
          {showCurrency ? (
            <View className="items-center justify-center border-r border-border px-4 dark:border-d-border">
              <Text
                className="text-base font-semibold text-foreground dark:text-d-text"
                style={{ color: colors.foreground }}
              >
                {currencySymbol}
              </Text>
            </View>
          ) : null}
          <TextInput
            value={value}
            onChangeText={handleChange}
            placeholder={goalTargetInputPlaceholder(type)}
            placeholderTextColor={colors.mutedForeground}
            keyboardType={showCurrency ? MONEY_KEYBOARD : "number-pad"}
            autoCorrect={false}
            autoComplete="off"
            selectionColor={colors.primary}
            style={{
              flex: 1,
              minWidth: 0,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 18,
              fontWeight: "600",
              color: colors.foreground,
            }}
          />
        </View>

        {parsed != null && !isValid ? (
          <Text className="px-1 text-sm font-medium text-alert">
            {formatMinTargetError(type, minTarget, currencySymbol, strictMinTargets)}
          </Text>
        ) : null}
      </View>

      <Button
        label="Set goal"
        size="lg"
        fullWidth
        disabled={!isValid}
        onPress={onConfirm}
      />
    </View>
  );
}

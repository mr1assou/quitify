import { useMemo } from "react";
import { Text, TextInput, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import { SelectField } from "@/components/ui/SelectField";
import type { ProfileSex } from "@/types";
import {
  DAY_OPTIONS,
  MONTH_OPTIONS,
  PROFILE_SEX_OPTIONS,
  birthYearOptions,
} from "@/constants/onboardingSex";
import { useTheme } from "@/context/ThemeContext";
import { parseBirthYmd } from "@/utils/birthdate";

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;
  sex?: ProfileSex;
  onSexChange: (v: ProfileSex) => void;
  birthMonth?: number;
  birthDay?: number;
  birthYear?: number;
  onBirthMonthChange: (v: number | undefined) => void;
  onBirthDayChange: (v: number | undefined) => void;
  onBirthYearChange: (v: number | undefined) => void;
};

export function CreateProfileStep({
  username,
  onUsernameChange,
  sex,
  onSexChange,
  birthMonth,
  birthDay,
  birthYear,
  onBirthMonthChange,
  onBirthDayChange,
  onBirthYearChange,
}: Props) {
  const { colors } = useTheme();
  const yearOptions = useMemo(() => birthYearOptions(), []);

  const hasFullBirthDate =
    birthMonth != null && birthDay != null && birthYear != null;

  const parsedBirth = hasFullBirthDate
    ? parseBirthYmd(birthYear!, birthMonth!, birthDay!)
    : null;

  const showBirthDateError = hasFullBirthDate && parsedBirth === null;

  return (
    <View className="w-full gap-5">
      <View className="gap-1">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={onUsernameChange}
          placeholder="How should we call you?"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
        />
      </View>

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Sex
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {PROFILE_SEX_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              label={opt.label}
              selected={sex === opt.id}
              onPress={() => onSexChange(opt.id)}
            />
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Birthday
        </Text>
        <View className="flex-row gap-2">
          <SelectField
            fieldLabel="Month"
            value={birthMonth}
            placeholder="Month"
            options={MONTH_OPTIONS}
            onChange={onBirthMonthChange}
          />
          <SelectField
            fieldLabel="Day"
            value={birthDay}
            placeholder="Day"
            options={DAY_OPTIONS}
            onChange={onBirthDayChange}
          />
          <SelectField
            fieldLabel="Year"
            value={birthYear}
            placeholder="Year"
            options={yearOptions}
            onChange={onBirthYearChange}
          />
        </View>
        {showBirthDateError ? (
          <Text className="text-sm text-alert">
            Enter a valid date (age must be between 5 and 120 years).
          </Text>
        ) : null}
      </View>
    </View>
  );
}

import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import type { ProfileSex } from "@/types";
import {
  normalizeOnboardingUsername,
  usernameHandleLength,
  USERNAME_MAX_LENGTH,
  USERNAME_STORED_MAX_LENGTH,
} from "@/constants/onboarding/onboardingUsername";
import { PROFILE_SEX_OPTIONS } from "@/constants/onboarding/onboardingSex";
import { useTheme } from "@/context/ThemeContext";
import { useUsernameAvailability } from "@/hooks/auth/useUsernameAvailability";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useTranslation } from "@/hooks/i18n/useTranslation";

type AvailabilityChange = {
  canUse: boolean;
  taken: boolean;
  checking: boolean;
};

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;
  sex?: ProfileSex;
  onSexChange: (v: ProfileSex) => void;
  /** Notifies parent when debounced availability changes (for Continue button). */
  onAvailabilityChange?: (state: AvailabilityChange) => void;
  usernameError?: string;
  sexError?: string;
};

export function CreateProfileStep({
  username,
  onUsernameChange,
  sex,
  onSexChange,
  onAvailabilityChange,
  usernameError,
  sexError,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { localize } = useLocalizedCatalog();
  const sexOptions = localize(PROFILE_SEX_OPTIONS, "onboarding.profile.sex", ["label"]);
  const availability = useUsernameAvailability(username);

  useEffect(() => {
    onAvailabilityChange?.({
      canUse: availability.canUse,
      taken: availability.taken,
      checking: availability.checking,
    });
  }, [
    availability.canUse,
    availability.taken,
    availability.checking,
    onAvailabilityChange,
  ]);

  return (
    <View className="w-full gap-5">
      <View className="gap-1">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {t("onboarding.profile.username.label")}
        </Text>
        <TextInput
          value={username}
          onChangeText={(text) => onUsernameChange(normalizeOnboardingUsername(text))}
          placeholder={t("onboarding.profile.username.placeholder")}
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={USERNAME_STORED_MAX_LENGTH}
          className="rounded-2xl bg-section px-4 py-3 text-base text-foreground dark:bg-d-surface dark:text-d-text"
        />
        <Text className="text-xs text-muted-foreground dark:text-d-muted">
          {usernameHandleLength(username)}/{USERNAME_MAX_LENGTH} characters
        </Text>
        {availability.taken && !usernameError ? (
          <Text className="text-xs font-semibold text-alert">
            {t("onboarding.profile.username.taken")}
          </Text>
        ) : null}
        {usernameError ? (
          <Text className="text-xs font-semibold text-alert">{usernameError}</Text>
        ) : null}
      </View>

      <View className="gap-2">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          {t("onboarding.profile.sex.label")}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {sexOptions.map((opt) => (
            <Chip
              key={opt.id}
              label={opt.label}
              selected={sex === opt.id}
              onPress={() => onSexChange(opt.id)}
            />
          ))}
        </View>
        {sexError ? (
          <Text className="text-xs font-semibold text-alert">{sexError}</Text>
        ) : null}
      </View>
    </View>
  );
}

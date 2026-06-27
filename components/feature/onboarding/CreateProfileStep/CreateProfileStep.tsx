import { Text, TextInput, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import type { ProfileSex } from "@/types";
import {
  normalizeOnboardingUsername,
  USERNAME_MAX_LENGTH,
} from "@/constants/onboarding/onboardingUsername";
import { PROFILE_SEX_OPTIONS } from "@/constants/onboarding/onboardingSex";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  username: string;
  onUsernameChange: (v: string) => void;
  sex?: ProfileSex;
  onSexChange: (v: ProfileSex) => void;
};

export function CreateProfileStep({
  username,
  onUsernameChange,
  sex,
  onSexChange,
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="w-full gap-5">
      <View className="gap-1">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted-foreground dark:text-d-muted">
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={(text) => onUsernameChange(normalizeOnboardingUsername(text))}
          placeholder="How should we call you?"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={USERNAME_MAX_LENGTH}
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
    </View>
  );
}

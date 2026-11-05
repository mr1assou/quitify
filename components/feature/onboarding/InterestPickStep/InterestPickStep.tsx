import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { OnboardingOtherComposer } from "@/components/feature/onboarding/shared/OnboardingOtherComposer";
import { Chip } from "@/components/ui/Chip";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import {
  PRIMARY_INTEREST_OPTIONS,
  type PrimaryInterestId,
} from "@/constants/onboarding/onboardingPrimaryInterest";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useOnboardingOtherComposer } from "@/hooks/onboarding/useOnboardingOtherComposer";

type Props = {
  selectedIds: readonly PrimaryInterestId[];
  onToggle: (id: PrimaryInterestId) => void;
  otherSelected: boolean;
  otherText: string;
  otherPlaceholder: string;
  onOtherTextChange: (text: string) => void;
};

export function InterestPickStep({
  selectedIds,
  onToggle,
  otherSelected,
  otherText,
  otherPlaceholder,
  onOtherTextChange,
}: Props) {
  const { localize } = useLocalizedCatalog();
  const ids = selectedIds ?? [];
  const { composerOpen, inputRef, openComposer, closeComposer } =
    useOnboardingOtherComposer(otherSelected, otherText, () =>
      onToggle(ONBOARDING_OTHER_ID),
    );

  const options = useMemo(
    () => localize(PRIMARY_INTEREST_OPTIONS, "onboarding.interests", ["label"]),
    [localize],
  );

  const handlePress = (id: PrimaryInterestId) => {
    if (id === ONBOARDING_OTHER_ID) {
      if (otherSelected) {
        openComposer();
        return;
      }
      onToggle(ONBOARDING_OTHER_ID);
      return;
    }
    onToggle(id);
  };

  return (
    <View className="w-full gap-3">
      {options.map((opt) => (
        <Chip
          key={opt.id}
          label={opt.label}
          size="lg"
          fullWidth
          selected={ids.includes(opt.id)}
          onPress={() => handlePress(opt.id)}
        />
      ))}

      {otherSelected && otherText.trim().length > 0 && !composerOpen ? (
        <Pressable
          onPress={openComposer}
          className="rounded-2xl border border-border bg-elevated px-4 py-3 dark:border-d-border dark:bg-d-elevated"
        >
          <Text
            className="text-sm leading-5 text-foreground dark:text-d-text"
            numberOfLines={3}
          >
            {otherText.trim()}
          </Text>
        </Pressable>
      ) : null}

      <OnboardingOtherComposer
        visible={composerOpen && otherSelected}
        value={otherText}
        placeholder={otherPlaceholder}
        inputRef={inputRef}
        onChangeText={onOtherTextChange}
        onClose={closeComposer}
      />
    </View>
  );
}

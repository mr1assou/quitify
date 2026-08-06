import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import { OnboardingOtherComposer } from "@/components/feature/onboarding/shared/OnboardingOtherComposer";
import { Chip } from "@/components/ui/Chip";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import {
  PRIOR_QUIT_ATTEMPT_OPTIONS,
  type PriorQuitAttempts,
} from "@/constants/onboarding/onboardingPriorQuitAttempts";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useOnboardingOtherComposer } from "@/hooks/onboarding/useOnboardingOtherComposer";

type Props = {
  selected?: PriorQuitAttempts;
  onSelect: (value: PriorQuitAttempts) => void;
  onClearOther: () => void;
  otherText: string;
  otherPlaceholder: string;
  onOtherTextChange: (text: string) => void;
};

export function QuitAttemptsPickStep({
  selected,
  onSelect,
  onClearOther,
  otherText,
  otherPlaceholder,
  onOtherTextChange,
}: Props) {
  const { localize } = useLocalizedCatalog();
  const otherSelected = selected === ONBOARDING_OTHER_ID;
  const { composerOpen, inputRef, openComposer, closeComposer } =
    useOnboardingOtherComposer(otherSelected, otherText, onClearOther);

  const options = useMemo(
    () =>
      localize(PRIOR_QUIT_ATTEMPT_OPTIONS, "onboarding.quitAttempts", ["label"]),
    [localize],
  );

  const handleSelect = (id: PriorQuitAttempts) => {
    if (id === ONBOARDING_OTHER_ID) {
      if (otherSelected) {
        openComposer();
        return;
      }
      onSelect(ONBOARDING_OTHER_ID);
      return;
    }
    onSelect(id);
  };

  return (
    <View className="w-full gap-3">
      {options.map((opt) => (
        <Chip
          key={opt.id}
          label={opt.label}
          size="lg"
          fullWidth
          selected={selected === opt.id}
          onPress={() => handleSelect(opt.id)}
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

import { Pressable, ScrollView, Text, View } from "react-native";

import { OnboardingOtherComposer } from "@/components/feature/onboarding/shared/OnboardingOtherComposer";
import { Chip } from "@/components/ui/Chip";
import { ONBOARDING_OTHER_ID } from "@/constants/onboarding/onboardingOther";
import { useOnboardingOtherComposer } from "@/hooks/onboarding/useOnboardingOtherComposer";

type Option = { id: string; label: string };

type Props = {
  options: readonly Option[];
  selectedIds: readonly string[];
  onToggle: (id: string) => void;
  otherSelected: boolean;
  otherText: string;
  otherPlaceholder: string;
  onOtherTextChange: (text: string) => void;
};

export function ReasonsPickStep({
  options,
  selectedIds,
  onToggle,
  otherSelected,
  otherText,
  otherPlaceholder,
  onOtherTextChange,
}: Props) {
  const ids = selectedIds ?? [];
  const { composerOpen, inputRef, openComposer, closeComposer } =
    useOnboardingOtherComposer(otherSelected, otherText, () =>
      onToggle(ONBOARDING_OTHER_ID),
    );

  const handleOptionPress = (id: string) => {
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
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <View className="flex-row flex-wrap justify-center gap-2">
          {options.map((o) => (
            <Chip
              key={o.id}
              label={o.label}
              selected={ids.includes(o.id)}
              onPress={() => handleOptionPress(o.id)}
            />
          ))}
        </View>

        {otherSelected && otherText.trim().length > 0 && !composerOpen ? (
          <Pressable
            onPress={() => handleOptionPress(ONBOARDING_OTHER_ID)}
            className="mt-3 rounded-2xl border border-border bg-elevated px-4 py-3 dark:border-d-border dark:bg-d-elevated"
          >
            <Text
              className="text-sm leading-5 text-foreground dark:text-d-text"
              numberOfLines={3}
            >
              {otherText.trim()}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <OnboardingOtherComposer
        visible={composerOpen && otherSelected}
        value={otherText}
        placeholder={otherPlaceholder}
        inputRef={inputRef}
        onChangeText={onOtherTextChange}
        onClose={closeComposer}
      />
    </>
  );
}

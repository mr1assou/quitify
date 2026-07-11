import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { Chip } from "@/components/ui/Chip";
import {
  PRIMARY_INTEREST_OPTIONS,
  type PrimaryInterestId,
} from "@/constants/onboarding/onboardingPrimaryInterest";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";

type Props = {
  selectedIds: readonly PrimaryInterestId[];
  onToggle: (id: PrimaryInterestId) => void;
};

export function InterestPickStep({ selectedIds, onToggle }: Props) {
  const { localize } = useLocalizedCatalog();
  const ids = selectedIds ?? [];
  const options = useMemo(
    () => localize(PRIMARY_INTEREST_OPTIONS, "onboarding.interests", ["label"]),
    [localize],
  );

  return (
    <ScrollView
      className="w-full flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 8 }}
    >
      <View className="w-full gap-3">
        {options.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            size="lg"
            fullWidth
            selected={ids.includes(opt.id)}
            onPress={() => onToggle(opt.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

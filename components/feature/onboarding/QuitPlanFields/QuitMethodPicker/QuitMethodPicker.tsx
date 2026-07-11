import { useMemo } from "react";
import { Text, View } from "react-native";

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import { SelectFieldString } from "@/components/ui/SelectFieldString";
import { ONBOARDING_CONTROL_HEIGHT } from "@/constants/onboarding/onboardingFlow";
import { QUIT_METHOD_OPTIONS } from "@/constants/onboarding/onboardingQuitPlan";
import { useLocalizedCatalog } from "@/hooks/i18n/useLocalizedCatalog";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { QuitMethod } from "@/types/onboarding/onboarding";

type Props = {
  selected?: QuitMethod;
  onSelect: (method: QuitMethod) => void;
};

export function QuitMethodPicker({ selected, onSelect }: Props) {
  const { t } = useTranslation();
  const { localize, label } = useLocalizedCatalog();

  const options = useMemo(
    () =>
      localize(QUIT_METHOD_OPTIONS, "onboarding.quitPlan", ["label"]).map((option) => ({
        value: option.id,
        label: option.label,
      })),
    [localize],
  );

  const hint = selected ? label("onboarding.quitPlan", selected, "hint") : undefined;
  const fieldLabel = t("onboarding.quitPlan.methodTitle");

  return (
    <View className="gap-1.5">
      <OnboardingFieldLabel>{fieldLabel}</OnboardingFieldLabel>
      <SelectFieldString
        fieldLabel={fieldLabel}
        value={selected}
        placeholder={t("common.selectMethod")}
        options={options}
        allowClear={false}
        showLabel={false}
        controlHeight={ONBOARDING_CONTROL_HEIGHT}
        onChange={(value) => {
          if (value === "cold_turkey" || value === "gradual") onSelect(value);
        }}
      />
      {hint ? (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

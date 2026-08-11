import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useEffect } from "react";

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import {
  COUNTRY_CURRENCY_CONTROL_HEIGHT,
  COUNTRY_CURRENCY_CURRENCY_WIDTH,
} from "@/constants/onboarding/onboardingCountryRow";
import {
  DEFAULT_ONBOARDING_COUNTRY_CODE,
  findCountryByCode,
} from "@/constants/onboarding/defaultCountry";
import { useCountries } from "@/hooks/onboarding/useCountries";
import { useCountrySelection } from "@/hooks/onboarding/useCountrySelection";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import type { OnboardingDraft } from "@/types";
import { currencySymbol } from "@/utils/shared/format";

import { CountrySelectField } from "./CountrySelectField";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
  fieldError?: string;
};

function CurrencyDisplay({
  currency,
  loading,
  hasCountry,
}: {
  currency: string;
  loading: boolean;
  hasCountry: boolean;
}) {
  const symbol = currencySymbol(currency);
  const showSymbol =
    hasCountry && symbol.trim() !== currency && symbol.trim().length > 0;

  return (
    <View
      className="items-center justify-center rounded-2xl bg-section dark:bg-d-surface"
      style={{
        width: COUNTRY_CURRENCY_CURRENCY_WIDTH,
        height: COUNTRY_CURRENCY_CONTROL_HEIGHT,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : hasCountry ? (
        <Text
          className="text-sm font-semibold text-foreground dark:text-d-text"
          numberOfLines={1}
        >
          {showSymbol ? symbol.trim() : currency}
        </Text>
      ) : (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">—</Text>
      )}
    </View>
  );
}

export function CountryFields({ draft, patch, fieldError }: Props) {
  const { t } = useTranslation();
  const { countries, status, error: loadError, retry } = useCountries();
  const { selectCountry } = useCountrySelection(patch);

  const loadingCountries = status === "loading";
  const hasCountry = !!draft.countryCode && status === "ready";

  // Keep default Canada in sync with the loaded country list (flag / currency).
  useEffect(() => {
    if (status !== "ready" || countries.length === 0) return;
    if (draft.countryCode && draft.countryCode !== DEFAULT_ONBOARDING_COUNTRY_CODE) {
      return;
    }
    const canada = findCountryByCode(countries, DEFAULT_ONBOARDING_COUNTRY_CODE);
    if (!canada) return;
    if (
      draft.countryCode === canada.code &&
      draft.countryName === canada.name &&
      draft.countryFlag === canada.flagPng &&
      draft.currency === canada.currencyCode
    ) {
      return;
    }
    selectCountry(canada);
  }, [
    countries,
    draft.countryCode,
    draft.countryFlag,
    draft.countryName,
    draft.currency,
    selectCountry,
    status,
  ]);

  return (
    <View className="gap-2">
      <View className="flex-row gap-2">
        <View className="min-w-0 flex-1">
          <OnboardingFieldLabel>Country</OnboardingFieldLabel>
        </View>
        <View style={{ width: COUNTRY_CURRENCY_CURRENCY_WIDTH }}>
          <OnboardingFieldLabel>Currency</OnboardingFieldLabel>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="min-w-0 flex-1">
          <CountrySelectField
            countries={countries}
            selectedCode={draft.countryCode}
            loading={loadingCountries}
            onSelect={selectCountry}
            showLabel={false}
            controlHeight={COUNTRY_CURRENCY_CONTROL_HEIGHT}
          />
        </View>
        <CurrencyDisplay
          currency={draft.currency}
          loading={loadingCountries}
          hasCountry={hasCountry}
        />
      </View>

      <Text className="text-xs text-muted-foreground dark:text-d-muted">
        {t("onboarding.profile.country.hint")}
      </Text>

      {status === "error" ? (
        <View className="gap-2">
          <Text className="text-sm text-alert">{loadError}</Text>
          <Pressable onPress={retry} className="self-start">
            <Text className="text-sm font-semibold text-primary dark:text-d-primary">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : null}
      {status !== "error" && fieldError ? (
        <Text className="text-xs font-semibold text-alert">{fieldError}</Text>
      ) : null}
    </View>
  );
}

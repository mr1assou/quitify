import { Image } from "expo-image";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { OnboardingFieldLabel } from "@/components/feature/onboarding/shared/OnboardingFieldLabel";
import {
  COUNTRY_CURRENCY_CONTROL_HEIGHT,
  COUNTRY_CURRENCY_CURRENCY_WIDTH,
} from "@/constants/onboarding/onboardingCountryRow";
import { useAutoSelectCountry } from "@/hooks/onboarding/useAutoSelectCountry";
import { useCountries } from "@/hooks/onboarding/useCountries";
import { useCountrySelection } from "@/hooks/onboarding/useCountrySelection";
import type { OnboardingDraft } from "@/types";
import { currencySymbol } from "@/utils/shared/format";

type Props = {
  draft: OnboardingDraft;
  patch: (next: Partial<OnboardingDraft>) => void;
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

function CountryDisplay({
  name,
  flagPng,
  loading,
}: {
  name?: string;
  flagPng?: string;
  loading: boolean;
}) {
  return (
    <View
      className="flex-row items-center rounded-2xl bg-section px-3 dark:bg-d-surface"
      style={{ height: COUNTRY_CURRENCY_CONTROL_HEIGHT }}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : name && flagPng ? (
        <View className="flex-1 flex-row items-center gap-3">
          <Image
            source={{ uri: flagPng }}
            style={{ width: 24, height: 17, borderRadius: 2 }}
            contentFit="cover"
          />
          <Text
            className="flex-1 text-sm text-foreground dark:text-d-text"
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      ) : (
        <Text className="text-sm text-muted-foreground dark:text-d-muted">
          Detecting your country…
        </Text>
      )}
    </View>
  );
}

export function CountryFields({ draft, patch }: Props) {
  const { countries, status, error, retry } = useCountries();
  const { selectCountry } = useCountrySelection(patch);

  useAutoSelectCountry(
    countries,
    status === "ready",
    draft.countryCode,
    selectCountry,
  );

  const selectedCountry = useMemo(
    () => countries.find((country) => country.code === draft.countryCode),
    [countries, draft.countryCode],
  );

  const loadingCountries = status === "loading";
  const detectingCountry = status === "ready" && !draft.countryCode;
  const loading = loadingCountries || detectingCountry;
  const hasCountry = !!draft.countryCode && status === "ready";

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
          <CountryDisplay
            name={selectedCountry?.name}
            flagPng={selectedCountry?.flagPng}
            loading={loading}
          />
        </View>
        <CurrencyDisplay
          currency={draft.currency}
          loading={loading}
          hasCountry={hasCountry}
        />
      </View>

      {status === "error" ? (
        <View className="gap-2">
          <Text className="text-sm text-alert">{error}</Text>
          <Pressable onPress={retry} className="self-start">
            <Text className="text-sm font-semibold text-primary dark:text-d-primary">
              Try again
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

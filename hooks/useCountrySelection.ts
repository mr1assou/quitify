import { useCallback } from "react";

import type { OnboardingDraft } from "@/types";
import type { Country } from "@/types/country";

type Patch = (next: Partial<OnboardingDraft>) => void;

/** Step 5 — selecting a country also sets `currency` from API data. */
export function useCountrySelection(patch: Patch) {
  const selectCountry = useCallback(
    (country: Country) => {
      patch({
        countryCode: country.code,
        countryName: country.name,
        countryFlag: country.flagPng,
        currency: country.currencyCode,
      });
    },
    [patch],
  );

  return { selectCountry };
}

import { FALLBACK_COUNTRIES } from "@/constants/app/fallbackCountries";
import type { Country } from "@/types/app/country";

/** Default country selected in onboarding (Canada). */
export const DEFAULT_ONBOARDING_COUNTRY_CODE = "CA" as const;

const FALLBACK_CANADA: Country =
  FALLBACK_COUNTRIES.find((country) => country.code === DEFAULT_ONBOARDING_COUNTRY_CODE) ?? {
    code: "CA",
    name: "Canada",
    flagPng: "https://flagcdn.com/w320/ca.png",
    currencyCode: "CAD",
  };

export const DEFAULT_ONBOARDING_COUNTRY: Country = FALLBACK_CANADA;

export function findCountryByCode(
  countries: readonly Country[],
  code: string,
): Country | undefined {
  return countries.find((country) => country.code === code);
}

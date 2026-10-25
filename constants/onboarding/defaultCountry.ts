import { COUNTRIES } from "@/constants/app/countries";
import type { Country } from "@/types/app/country";

/** Default country selected in onboarding (Canada). */
export const DEFAULT_ONBOARDING_COUNTRY_CODE = "CA" as const;

export const DEFAULT_ONBOARDING_COUNTRY: Country = COUNTRIES.find(
  (country) => country.code === DEFAULT_ONBOARDING_COUNTRY_CODE,
)!;

export function findCountryByCode(
  countries: readonly Country[],
  code: string,
): Country | undefined {
  return countries.find((country) => country.code === code);
}

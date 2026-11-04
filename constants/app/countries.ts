import { COUNTRY_FLAG_ASSETS } from "@/constants/app/countryFlagAssets";
import { COUNTRY_METADATA } from "@/constants/app/countryMetadata";
import { flagUrlForCode } from "@/constants/leaderboard/leaderboardCountries";
import type { Country } from "@/types/app/country";
import { sortCountriesForPicker } from "@/utils/shared/countries";

/** Bundled picker data; opening Step 5 does not wait for a network request. */
export const COUNTRIES: Country[] = sortCountriesForPicker(
  COUNTRY_METADATA.map((country): Country => ({
    ...country,
    flagPng: flagUrlForCode(country.code),
    flagAsset: COUNTRY_FLAG_ASSETS[country.code],
  })),
);

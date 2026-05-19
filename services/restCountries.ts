import type { RestCountryDto } from "@/types/country";

const REST_COUNTRIES_FIELDS = "name,flags,currencies,cca2";
const REST_COUNTRIES_URL = `https://restcountries.com/v3.1/all?fields=${REST_COUNTRIES_FIELDS}`;

/** Fetches the slim country list used for onboarding country + currency. */
export async function fetchRestCountries(): Promise<RestCountryDto[]> {
  const res = await fetch(REST_COUNTRIES_URL);
  if (!res.ok) {
    throw new Error(`Countries request failed (${res.status})`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected countries response");
  }
  return data as RestCountryDto[];
}

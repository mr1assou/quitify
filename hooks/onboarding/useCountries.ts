import { COUNTRIES } from "@/constants/app/countries";
import type { Country } from "@/types/app/country";

/** Returns bundled country data synchronously; no API request or loading state. */
export function useCountries(): readonly Country[] {
  return COUNTRIES;
}

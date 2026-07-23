import { useEffect, useRef } from "react";

import type { Country } from "@/types/app/country";

const DEFAULT_COUNTRY_CODE = "US";

/** Pre-fills United States (+ USD) when the user hasn't chosen a country yet. */
export function useAutoSelectCountry(
  countries: Country[],
  ready: boolean,
  selectedCode: string | undefined,
  onSelect: (country: Country) => void,
) {
  const appliedRef = useRef(false);

  useEffect(() => {
    if (!ready || appliedRef.current || selectedCode || countries.length === 0) return;

    const match = countries.find(
      (country) => country.code.toUpperCase() === DEFAULT_COUNTRY_CODE,
    );
    if (!match) return;

    appliedRef.current = true;
    onSelect(match);
  }, [ready, selectedCode, countries, onSelect]);
}
